"use strict"
// Real-time 1v1 "ghost race" matches, server authoritative.
// Clients only send taps. The server runs the shared rules to decide hits,
// score, next targets and deaths, and broadcasts every player's state.
// No tick loop is needed: between taps the game is a function of time.
const { Server } = require("socket.io")
const levelsConfig = require("./settings/levels/levels-config")
const rules = require("./shared/multiplayer-rules")

const COUNTDOWN_MS = 3000
const DIFFICULTIES = ["easy", "medium", "hard"]
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ" // no I / O to avoid confusion

// lag compensation: a tap may be judged up to `rewind` ms before it arrived
const MIN_REWIND = 50
const MAX_REWIND = 250
const REWIND_MARGIN = 50 // jitter allowance on top of half the round trip
const DEFAULT_RTT = 200
// deaths are final only after the longest possible rewind has passed,
// so a late (but legitimately earlier) tap or death can still be taken into account
const DEATH_GRACE = MAX_REWIND
const RTT_PING_INTERVAL = 2000

const rooms = new Map() // code -> room
const queue = [] // sockets waiting for a random opponent

function getBasicLevel(difficulty) {
  const index = levelsConfig.findIndex(
    ({ info }) => info.name === "basic" && info.difficulty === difficulty
  )
  return { level: index + 1, ...levelsConfig[index] }
}

function generateCode() {
  let code
  do {
    code = ""
    for (let i = 0; i < 4; i++)
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  } while (rooms.has(code))
  return code
}

function createRoom(difficulty) {
  const room = {
    code: generateCode(),
    difficulty,
    players: [],
    match: null,
    rematch: new Set(),
  }
  rooms.set(room.code, room)
  return room
}

function opponentOf(room, socket) {
  return room.players.find((player) => player !== socket)
}

function publicPlayer(socket) {
  return { id: socket.id, ...socket.data.profile }
}

function emitToRoom(room, event, data) {
  room.players.forEach((socket) => socket.emit(event, data))
}

function startMatch(room) {
  const difficulty =
    room.difficulty ||
    DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)]
  const { level, info, config } = getBasicLevel(difficulty)
  const seed = Math.floor(Math.random() * 2 ** 31).toString(36)
  const start_at = Date.now() + COUNTDOWN_MS

  room.rematch.clear()
  const match = {
    config,
    seed,
    start_at,
    layout: rules.targetLayout(config),
    players: new Map(),
    ended: false,
  }
  room.players.forEach((socket) => {
    const player = {
      socket,
      state: rules.initialState(config, seed, start_at),
      alive: true,
      death_at: null,
      timer: null,
    }
    match.players.set(socket.id, player)
    scheduleDeathCheck(room, match, player)
  })
  room.match = match

  const payload = { code: room.code, level, difficulty, info, config, seed, startAt: start_at }
  room.players.forEach((socket) =>
    socket.emit("match:start", {
      ...payload,
      opponent: publicPlayer(opponentOf(room, socket)),
    })
  )
}

function clearMatchTimers(match) {
  match.players.forEach((player) => clearTimeout(player.timer))
}

function getScores(match) {
  const scores = {}
  match.players.forEach((player, id) => (scores[id] = player.state.score))
  return scores
}

function endMatch(room, { winner = null, loser = null, draw = false, reason }) {
  const { match } = room
  if (!match || match.ended) return
  match.ended = true
  clearMatchTimers(match)

  emitToRoom(room, "match:end", {
    winner,
    loser,
    draw,
    scores: getScores(match),
    reason,
  })
}

function markDead(room, match, player, death_at) {
  if (!player.alive) return
  player.alive = false
  player.death_at = death_at
  clearTimeout(player.timer)

  emitToRoom(room, "player:died", {
    id: player.socket.id,
    t: death_at,
    score: player.state.score,
  })

  // resolve once nothing can arrive anymore that happened before this death
  const resolve_at = death_at + DEATH_GRACE
  player.timer = setTimeout(
    () => resolveMatch(room, match, resolve_at),
    Math.max(0, resolve_at - Date.now())
  )
}

// a player who doesn't tap dies when the circle passes the target
function scheduleDeathCheck(room, match, player) {
  clearTimeout(player.timer)
  const death_at = rules.deathTime(player.state, match.layout)
  const resolve_at = death_at + DEATH_GRACE
  player.timer = setTimeout(() => {
    markDead(room, match, player, death_at)
    resolveMatch(room, match, resolve_at)
  }, Math.max(0, resolve_at - Date.now()))
}

// scheduled_at: timers may fire a fraction of a ms before Date.now() reaches their target
function resolveMatch(room, match, scheduled_at = 0) {
  if (match.ended || room.match !== match) return
  const now = Math.max(Date.now(), scheduled_at)

  // timers can fire a few ms out of order, settle every death that is already certain
  match.players.forEach((player) => {
    if (!player.alive) return
    const death_at = rules.deathTime(player.state, match.layout)
    if (death_at + DEATH_GRACE <= now) markDead(room, match, player, death_at)
  })

  const dead = [...match.players.values()].filter(({ alive }) => !alive)
  if (!dead.length) return

  const first_death = Math.min(...dead.map(({ death_at }) => death_at))
  const losers = dead.filter(({ death_at }) => death_at - first_death < 1)

  if (losers.length > 1) return endMatch(room, { draw: true, reason: "died" })

  const loser = losers[0].socket.id
  const winner = room.players.find(({ id }) => id !== loser)
  endMatch(room, { winner: winner ? winner.id : null, loser, reason: "died" })
}

function handleTap(socket, { seq, t } = {}) {
  const room = rooms.get(socket.data.room)
  const match = room && room.match
  if (!match || match.ended) return
  const player = match.players.get(socket.id)
  if (!player || !player.alive) return

  const received = Date.now()
  if (received < match.start_at) return

  // trust the claimed tap time only within the lag compensation window
  const rewind = Math.min(
    MAX_REWIND,
    Math.max(MIN_REWIND, socket.data.rtt / 2 + REWIND_MARGIN)
  )
  let tap_time = typeof t === "number" && isFinite(t) ? t : received
  tap_time = Math.min(received, Math.max(received - rewind, tap_time))
  tap_time = Math.max(tap_time, match.start_at, player.state.t0)

  const result = rules.evaluateTap(
    player.state,
    tap_time,
    match.layout,
    match.config,
    match.seed
  )

  if (!result.hit) {
    emitToRoom(room, "player:state", {
      id: socket.id,
      seq,
      hit: false,
      state: player.state,
    })
    return markDead(room, match, player, result.death_at)
  }

  player.state = result.state
  emitToRoom(room, "player:state", {
    id: socket.id,
    seq,
    hit: true,
    perfect: result.perfect,
    state: player.state,
  })
  scheduleDeathCheck(room, match, player)
}

function leaveRoom(socket, reason = "left") {
  const code = socket.data.room
  if (!code) return
  socket.data.room = null
  socket.leave(code)

  const room = rooms.get(code)
  if (!room) return

  const { match } = room
  if (match && !match.ended) {
    const player = match.players.get(socket.id)
    if (player) markDead(room, match, player, Date.now())
    const winner = opponentOf(room, socket)
    endMatch(room, { winner: winner ? winner.id : null, loser: socket.id, reason })
  }

  room.players = room.players.filter((player) => player !== socket)
  if (room.players.length === 0) return rooms.delete(code)

  room.players.forEach((player) => player.emit("opponent:left"))
}

function leaveQueue(socket) {
  const index = queue.indexOf(socket)
  if (index !== -1) queue.splice(index, 1)
}

function joinRoom(socket, room) {
  room.players.push(socket)
  socket.data.room = room.code
  socket.join(room.code)
  if (room.players.length === 2) startMatch(room)
}

function sanitizeProfile(profile = {}) {
  const skins = profile.skins || {}
  return {
    nickname: String(profile.nickname || "Player").slice(0, 12),
    skins: {
      circles: skins.circles,
      sticks: skins.sticks,
      targets: skins.targets,
    },
  }
}

// round trip estimate, used to size the lag compensation window
function measureRtt(socket) {
  const sent = Date.now()
  socket.timeout(RTT_PING_INTERVAL).emit("rtt:ping", (error) => {
    if (error) return
    const rtt = Date.now() - sent
    socket.data.rtt = socket.data.rtt * 0.7 + rtt * 0.3
  })
}

module.exports = function attachMultiplayer(httpServer) {
  const io = new Server(httpServer, {
    path: process.env.SOCKET_IO_PATH || "/socket.io",
    cors: { origin: "*" },
    pingInterval: 5000,
    pingTimeout: 5000,
  })

  io.on("connection", (socket) => {
    socket.data.room = null
    socket.data.rtt = DEFAULT_RTT
    measureRtt(socket)
    const rtt_interval = setInterval(() => measureRtt(socket), RTT_PING_INTERVAL)

    // clock sync: client estimates offset = serverTime - clientTime
    socket.on("time:ping", (clientTime, ack) => {
      if (typeof ack === "function") ack({ clientTime, serverTime: Date.now() })
    })

    socket.on("queue:join", (profile) => {
      leaveRoom(socket)
      leaveQueue(socket)
      socket.data.profile = sanitizeProfile(profile)

      const opponent = queue.shift()
      if (!opponent) return queue.push(socket)

      const room = createRoom(null)
      joinRoom(opponent, room)
      joinRoom(socket, room)
    })

    socket.on("queue:leave", () => leaveQueue(socket))

    socket.on("room:create", ({ profile, difficulty } = {}, ack) => {
      leaveRoom(socket)
      leaveQueue(socket)
      socket.data.profile = sanitizeProfile(profile)

      const room = createRoom(
        DIFFICULTIES.includes(difficulty) ? difficulty : "easy"
      )
      joinRoom(socket, room)
      if (typeof ack === "function") ack({ code: room.code })
    })

    socket.on("room:join", ({ profile, code } = {}, ack) => {
      const room = rooms.get(String(code || "").toUpperCase())
      const reply = typeof ack === "function" ? ack : () => {}

      if (!room) return reply({ error: "Room not found" })
      if (room.players.length >= 2) return reply({ error: "Room is full" })

      leaveRoom(socket)
      leaveQueue(socket)
      socket.data.profile = sanitizeProfile(profile)
      reply({ code: room.code })
      joinRoom(socket, room)
    })

    socket.on("room:leave", () => {
      leaveRoom(socket)
      leaveQueue(socket)
    })

    socket.on("room:rematch", () => {
      const room = rooms.get(socket.data.room)
      if (!room || !room.match || !room.match.ended) return

      room.rematch.add(socket.id)
      const opponent = opponentOf(room, socket)
      if (opponent) opponent.emit("opponent:rematch")
      if (room.players.length === 2 && room.rematch.size === 2) startMatch(room)
    })

    // the only gameplay input a client can send
    socket.on("tap", (tap) => handleTap(socket, tap))

    socket.on("disconnect", () => {
      clearInterval(rtt_interval)
      leaveQueue(socket)
      leaveRoom(socket, "disconnect")
    })
  })

  return io
}
