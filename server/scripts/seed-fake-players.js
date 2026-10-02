"use strict"
// Fills the database with fake but realistic player activity (accounts, level
// progress, best scores, money, bought skins) so leaderboards and ranks look alive.
//
//   npm run seed:fake -- --players 300 --yes      add 300 fake players
//   npm run seed:fake -- --clear --yes            remove every fake player added before
//   options: --seed <text> (reproducible output), --dry-run (print a sample, write nothing)
//
// Fake players follow the game's real rules: levels unlock in order once the previous
// level's score_to_next_level is reached, a newly unlocked level starts at score 0,
// money is the sum of game scores (mystery levels pay nothing) minus bought skins.
// Their nicknames are recorded in a separate collection, so --clear removes exactly them.
require("dotenv").config()
const mongoose = require("mongoose")
const { Accounts, Levels } = require("../src/settings/db-models")
const levelsConfig = require("../src/settings/levels/levels-config")
const skinsSetup = require("../src/settings/customize-skins-setup")
const defaultAccount = require("../src/settings/account-default-db")

const REGISTRY = "seeded_fake_players" // not used by the game

// ---------- options ----------
const args = process.argv.slice(2)
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}
const flag = (name) => args.includes(`--${name}`)

const PLAYERS = Number(option("players", 300))
const SEED = option("seed", String(Date.now()))

// ---------- seeded random ----------
function mulberry32(seed) {
  let a = 0
  for (const char of String(seed)) a = Math.imul(a ^ char.charCodeAt(0), 2654435761)
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const random = mulberry32(SEED)
const between = (min, max) => min + Math.floor(random() * (max - min + 1))
const pick = (list) => list[Math.floor(random() * list.length)]
const chance = (probability) => random() < probability
const exponential = (mean) => -Math.log(1 - random()) * mean
// normal distribution (Box-Muller)
const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random())

// ---------- nicknames (3-10 chars, letters / digits / space / underscore) ----------
const WORDS = [
  "pixel", "shadow", "ninja", "tiger", "wolf", "ghost", "storm", "blaze", "frost", "viper",
  "nova", "orbit", "comet", "lucky", "spin", "dizzy", "bolt", "rocket", "turbo", "neon",
  "zen", "echo", "flash", "hawk", "panda", "fox", "raven", "luna", "sky", "drift",
  "kraken", "spark", "venom", "cosmo", "jelly", "mango", "kiwi", "cookie", "noodle", "bubble",
]
const NAMES = [
  "alex", "max", "kuba", "ola", "tom", "ana", "leo", "mia", "sam", "nina",
  "eric", "zoe", "kamil", "julia", "adam", "ewa", "lucas", "emma", "noah", "ella",
  "piotr", "olek", "maja", "igor", "kate", "john", "lena", "dawid", "oscar", "lily",
]
const capitalize = (word) => word[0].toUpperCase() + word.slice(1)
const NICKNAME_PATTERNS = [
  () => `${pick(NAMES)}${between(1, 99)}`,
  () => `${pick(NAMES)}${between(1995, 2012)}`,
  () => `${pick(WORDS)}${between(1, 999)}`,
  () => `${pick(WORDS)}_${pick(WORDS)}`,
  () => `${capitalize(pick(WORDS))}${capitalize(pick(WORDS))}`,
  () => `xX${pick(WORDS)}Xx`,
  () => `${pick(NAMES)}_${pick(WORDS)}`,
  () => `the ${pick(WORDS)}`,
  () => pick(WORDS) + pick(WORDS).slice(0, 3),
  () => capitalize(pick(NAMES)),
]
const VALID_NICKNAME = /^[a-z0-9 _]{3,10}$/i

function generateNickname(taken) {
  for (let attempt = 0; attempt < 1000; attempt++) {
    let nickname = pick(NICKNAME_PATTERNS)()
    if (chance(0.15)) nickname = nickname.toUpperCase()
    if (VALID_NICKNAME.test(nickname) && !taken.has(nickname.toLowerCase())) {
      taken.add(nickname.toLowerCase())
      return nickname
    }
  }
  throw new Error("could not generate a unique nickname")
}

// ---------- player simulation ----------
const LEVELS = levelsConfig.map(({ info }, index) => ({
  index,
  key: `${info.difficulty}-${info.name}`,
  threshold: info.score_to_next_level,
  mystery: info.name.endsWith("-"),
  // single target marathon that ends the game at the threshold (levels/point)
  endurance: info.name === "point-",
  // later levels are harder: the same skill scores less there
  difficulty: 1 + index / 40,
}))

const PROFILES = [
  // share of players, how many levels they keep trying before quitting, retries per level
  { name: "casual", share: 0.55, depth: () => between(1, 8), tries: 4 },
  { name: "regular", share: 0.33, depth: () => between(6, 35), tries: 7 },
  { name: "hardcore", share: 0.12, depth: () => between(25, LEVELS.length), tries: 12 },
]

function pickProfile() {
  let roll = random()
  for (const profile of PROFILES) if ((roll -= profile.share) < 0) return profile
  return PROFILES[0]
}

// typical best score on a level for a skill level; thresholds are a hint of how far
// a level can go, tiny thresholds (1) are still levels people score in
function typicalScore(level, skill) {
  return (Math.max(level.threshold, 14) * skill) / level.difficulty
}

function simulatePlayer() {
  const profile = pickProfile()
  // most players are average, a few are much better (log-normal)
  const skill = Math.min(3.2, Math.max(0.3, Math.exp(0.45 * gaussian()) * (profile.name === "hardcore" ? 1.4 : 1)))
  const depth = profile.depth()

  const scores = [] // { key, score } best score per reached level
  let earned = 0
  for (const level of LEVELS) {
    const typical = typicalScore(level, skill)
    const tries = 1 + Math.round(exponential(profile.tries))
    // chance to beat the threshold within those tries
    const per_try = level.endurance
      ? Math.min(0.3, 0.04 * skill)
      : Math.min(0.95, (typical / level.threshold) * 0.35)
    const passes =
      (level.endurance || level.threshold <= typical * 1.6) && chance(1 - Math.pow(1 - per_try, tries))
    const reached_depth = scores.length + 1 >= depth

    let best
    if (level.endurance) {
      // the marathon ends at the threshold, most attempts die long before
      best = passes ? level.threshold : Math.floor(level.threshold * Math.pow(random(), 1.4))
    } else if (passes) {
      // beat it, often by a margin that depends on skill
      best = level.threshold + Math.round(exponential(typical * 0.35))
      best = Math.min(best, level.threshold * 4 + 60)
    } else if (chance(0.88)) {
      // stuck: played it, best attempts get fairly close
      best = Math.floor(level.threshold * Math.pow(random(), 0.6))
    } else {
      best = 0 // unlocked but never played
    }

    scores.push({ key: level.key, score: best })
    // every game pays its score, best + weaker attempts (mystery levels pay nothing)
    if (!level.mystery && best > 0) earned += Math.round(best * (1 + (tries - 1) * 0.45))

    if (!passes) break
    if (reached_depth) {
      // beating a level always unlocks the next one at score 0, even if the player quits
      const next = LEVELS[level.index + 1]
      if (next) scores.push({ key: next.key, score: 0 })
      break
    }
  }

  return { profile: profile.name, skill, scores, earned }
}

// spend part of the money on skins, like players do in the customize screen
function buySkins(earned) {
  const owned = JSON.parse(JSON.stringify(defaultAccount.skins))
  let money = earned
  const budget = earned * (0.2 + random() * 0.7)
  let spent = 0

  for (const part of ["circles", "sticks", "targets"]) {
    const extra_free = skinsSetup[part].filter(({ cost, skin }) => cost === 0 && !owned[part].includes(Number(skin)))
    extra_free.forEach(({ skin }) => chance(0.4) && owned[part].push(Number(skin)))
  }

  const shop = Object.entries(skinsSetup).flatMap(([part, list]) =>
    list.filter(({ cost }) => cost > 0).map(({ skin, cost }) => ({ part, skin: Number(skin), cost }))
  )
  for (let attempt = 0; attempt < 12; attempt++) {
    const item = pick(shop)
    if (owned[item.part].includes(item.skin) || spent + item.cost > budget) continue
    owned[item.part].push(item.skin)
    spent += item.cost
  }
  money -= spent

  const current_skins = {}
  for (const part of ["circles", "sticks", "targets"])
    current_skins[part] = chance(0.35) ? 1 : pick(owned[part])

  return { skins: owned, current_skins, money }
}

// ---------- database ----------
async function connect() {
  if (!process.env.DB_URL) throw new Error("DB_URL is not set (server/.env or environment)")
  const target = new URL(process.env.DB_URL.replace(/^mongodb(\+srv)?:/, "http:"))
  console.log(`database: ${target.host}/${target.pathname.slice(1) || "test"}`)
  await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  return mongoose.connection.db.collection(REGISTRY)
}

async function seed(registry) {
  const existing = await Accounts.find({}, { _id: 1 }).lean()
  const taken = new Set(existing.map(({ _id }) => String(_id).toLowerCase()))

  const accounts = []
  const levels = []
  const stats = { casual: 0, regular: 0, hardcore: 0, levels: 0, deepest: 0 }

  for (let i = 0; i < PLAYERS; i++) {
    const nickname = generateNickname(taken)
    const player = simulatePlayer()
    accounts.push({ _id: nickname, ...buySkins(player.earned) })
    player.scores.forEach(({ key, score }) => levels.push({ nickname, level: key, score }))

    stats[player.profile]++
    stats.levels += player.scores.length
    stats.deepest = Math.max(stats.deepest, player.scores.length)
  }

  console.log(
    `${PLAYERS} players (casual ${stats.casual}, regular ${stats.regular}, hardcore ${stats.hardcore}),`,
    `${stats.levels} level scores, avg ${(stats.levels / PLAYERS).toFixed(1)} levels reached, deepest ${stats.deepest}`
  )

  if (flag("dry-run")) {
    accounts.slice(0, 5).forEach((account) =>
      console.log(
        account._id.padEnd(11),
        `money ${String(account.money).padStart(5)}`,
        "|",
        levels.filter(({ nickname }) => nickname === account._id).map(({ level, score }) => `${level}:${score}`).join(" ")
      )
    )
    return console.log("dry run, nothing written")
  }

  await Accounts.insertMany(accounts)
  await Levels.insertMany(levels)
  await registry.insertMany(accounts.map(({ _id }) => ({ nickname: _id, seed: SEED, created: new Date() })))
  console.log(`written (seed "${SEED}")`)
}

async function clear(registry) {
  const nicknames = (await registry.find({}, { projection: { nickname: 1 } }).toArray()).map(({ nickname }) => nickname)
  const accounts = await Accounts.deleteMany({ _id: { $in: nicknames } })
  const levels = await Levels.deleteMany({ nickname: { $in: nicknames } })
  await registry.deleteMany({ nickname: { $in: nicknames } })
  console.log(`removed ${accounts.deletedCount} fake accounts and ${levels.deletedCount} level scores`)
}

async function main() {
  if (!flag("yes") && !flag("dry-run")) {
    console.log("This writes to the database from DB_URL. Add --yes to run, or --dry-run to preview.")
    process.exit(1)
  }
  const registry = await connect()
  await (flag("clear") ? clear(registry) : seed(registry))
  await mongoose.disconnect()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
