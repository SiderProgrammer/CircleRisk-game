// In-memory stand-in for DatabaseManager, for local development without MongoDB
// (`npm run dev:nodb`). Same handlers and responses; data is lost on restart.
const defaultAccountConfig = require("./settings/account-default-db")

const accounts = new Map() // nickname -> account
const levels = [] // { nickname, level, score }

const copy = (object) => JSON.parse(JSON.stringify(object))

function createDefaultAccount(nickname) {
  accounts.set(nickname, copy(defaultAccountConfig))
  // mongoose default level, unlocks the first level (see Levels schema)
  levels.push({ nickname, level: "easy-basic", score: 0 })
}

class MemoryDatabaseManager {
  connectDatabase() {
    console.log("running without database, data is kept in memory")
  }

  createAccount(req, res) {
    const { nickname } = req.body
    if (accounts.has(nickname)) return res.sendStatus(403)
    createDefaultAccount(nickname)
    res.sendStatus(200)
  }

  getAccountProgress(req, res) {
    const { nickname } = req.body
    // phones keep their nickname across server restarts, recreate instead of forcing a new account
    if (nickname && !accounts.has(nickname)) createDefaultAccount(nickname)
    res.status(200).json(accounts.get(nickname) || null)
  }

  saveMoney(req, res) {
    const { money, nickname } = req.body
    if (accounts.has(nickname)) accounts.get(nickname).money = money
    res.sendStatus(200)
  }

  saveNewSkin(req, res) {
    const { nickname, skin } = req.body
    const account = accounts.get(nickname)
    if (account) account.skins[skin[0]].push(skin[1])
    res.sendStatus(200)
  }

  equipSkin(req, res) {
    const { nickname, current_skins } = req.body
    if (accounts.has(nickname)) accounts.get(nickname).current_skins = current_skins
    res.sendStatus(200)
  }

  getAccountScores(req, res) {
    const { level, nickname } = req.body
    res.json(
      levels
        .filter((entry) => entry.nickname === nickname && (!level || entry.level === level))
        .map(({ level, score }) => ({ level, score }))
    )
  }

  postLevelScore(req, res) {
    const { score, nickname, level } = req.body
    const entry = levels.find((e) => e.nickname === nickname && e.level === level)
    if (entry) entry.score = score
    else levels.push({ nickname, level, score })
    res.sendStatus(200)
  }

  getTopScores(req, res) {
    const { level, players_amount } = req.body
    res.json(
      levels
        .filter((entry) => entry.level === level)
        .sort((a, b) => b.score - a.score)
        .slice(0, players_amount)
        .map(({ score, nickname }) => ({ score, nickname }))
    )
  }

  getRankFromScore(req, res) {
    const { level, score } = req.body
    res.json(levels.filter((e) => e.level === level && e.score > score).length + 1)
  }
}

module.exports = MemoryDatabaseManager
