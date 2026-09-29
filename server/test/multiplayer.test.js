"use strict"
const test = require("node:test")
const assert = require("node:assert")
const http = require("http")
const { io } = require("socket.io-client")
const attachMultiplayer = require("../src/multiplayer")
const rules = require("../src/shared/multiplayer-rules")

let url
const server = http.createServer()
const sockets = []

test.before(async () => {
  attachMultiplayer(server)
  await new Promise((resolve) => server.listen(0, resolve))
  url = `http://localhost:${server.address().port}`
})

test.after(() => {
  sockets.forEach((socket) => socket.close())
  server.close()
  // socket.io keeps timers alive, the process must still finish
  setTimeout(() => process.exit(0), 100).unref()
})

function connect() {
  return new Promise((resolve) => {
    const socket = io(url, { transports: ["websocket"], reconnection: false })
    socket.on("rtt:ping", (ack) => ack())
    socket.on("connect", () => resolve(socket))
    sockets.push(socket)
  })
}

function once(socket, event, predicate = () => true, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout waiting for ${event}`)), timeout)
    const handler = (message) => {
      if (!predicate(message)) return
      clearTimeout(timer)
      socket.off(event, handler)
      resolve(message)
    }
    socket.on(event, handler)
  })
}

const request = (socket, event, payload) =>
  new Promise((resolve) => socket.emit(event, payload, resolve))

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function startRoomMatch(difficulty = "easy") {
  const [a, b] = await Promise.all([connect(), connect()])
  const { code } = await request(a, "room:create", { profile: { nickname: "A" }, difficulty })
  const starts = [once(a, "match:start"), once(b, "match:start")]
  await request(b, "room:join", { profile: { nickname: "B" }, code })
  const [match_a, match_b] = await Promise.all(starts)
  return { a, b, code, match: match_a, match_b }
}

async function rematch(a, b) {
  const starts = [once(a, "match:start"), once(b, "match:start")]
  a.emit("room:rematch")
  b.emit("room:rematch")
  return (await Promise.all(starts))[0]
}

// taps perfectly `hits` times using the shared rules; send_late_by simulates a cheating client
function bot(socket, match, { hits = Infinity, send_late_by = 0 } = {}) {
  const layout = rules.targetLayout(match.config)
  let state = rules.initialState(match.config, match.seed, match.startAt)
  let seq = 0
  let timer
  const results = []

  const plan = () => {
    if (seq >= hits) return
    const reach = (2 * Math.asin(rules.HIT_RADIUS / (2 * state.d)) * 180) / Math.PI
    const on_target = rules.deathTime(state, layout) - reach / ((state.speed * 60) / 1000)
    timer = setTimeout(
      () => socket.emit("tap", { seq: ++seq, t: on_target }),
      Math.max(0, on_target - Date.now() + send_late_by)
    )
  }
  const onState = (message) => {
    if (message.id !== socket.id) return
    results.push(message)
    if (message.hit) {
      state = message.state
      plan()
    }
  }
  socket.on("player:state", onState)
  plan()

  return {
    results,
    get state() {
      return state
    },
    stop() {
      clearTimeout(timer)
      socket.off("player:state", onState)
    },
  }
}

test("malformed payloads never crash the server", async () => {
  const socket = await connect()
  for (const event of ["room:create", "room:join", "queue:join", "tap", "time:ping"])
    for (const payload of [null, 42, "x", [], { profile: null, code: {} }]) socket.emit(event, payload)
  socket.emit("queue:leave")
  await sleep(100)

  const other = await connect()
  const reply = await request(other, "room:create", { difficulty: "hard" })
  assert.match(reply.code, /^[A-Z]{4}$/)
  socket.emit("room:leave")
  other.emit("room:leave")
})

test("rooms: not found, own room, full, case insensitive", async () => {
  const [a, b, c] = await Promise.all([connect(), connect(), connect()])
  assert.deepStrictEqual(await request(c, "room:join", { code: "ZZZZ" }), {
    error: "Room not found",
  })

  const { code } = await request(a, "room:create", { difficulty: "medium" })
  assert.deepStrictEqual(await request(a, "room:join", { code }), {
    error: "That's your own room",
  })

  const start = once(a, "match:start")
  assert.deepStrictEqual(await request(b, "room:join", { code: code.toLowerCase() }), { code })
  const match = await start
  assert.strictEqual(match.difficulty, "medium")
  assert.strictEqual(match.info.name, "basic")

  assert.deepStrictEqual(await request(c, "room:join", { code }), { error: "Room is full" })
  ;[a, b, c].forEach((socket) => socket.emit("room:leave"))
})

test("queue pairs two players with the same seed and start time", async () => {
  const [a, b] = await Promise.all([connect(), connect()])
  const starts = [once(a, "match:start"), once(b, "match:start")]
  a.emit("queue:join", { nickname: "A" })
  b.emit("queue:join", { nickname: "B" })
  const [match_a, match_b] = await Promise.all(starts)
  assert.strictEqual(match_a.seed, match_b.seed)
  assert.strictEqual(match_a.startAt, match_b.startAt)
  assert.strictEqual(match_a.opponent.nickname, "B")
  assert.strictEqual(match_b.opponent.nickname, "A")
  a.emit("room:leave")
  b.emit("room:leave")
})

test("server decides the match: perfect play wins, fake messages are ignored", async () => {
  const { a, b, match } = await startRoomMatch()
  a.emit("died", { score: 999 })
  a.emit("state", { s: 999 })

  const bot_a = bot(a, match, { hits: 5 })
  const bot_b = bot(b, match, { hits: 3 })
  const died = once(a, "player:died", ({ id }) => id === b.id)
  const end = await once(a, "match:end")

  assert.strictEqual(end.winner, a.id)
  assert.strictEqual(end.loser, b.id)
  assert.strictEqual(end.scores[b.id], 6)
  assert.ok(bot_b.results.every(({ hit, perfect }) => hit && perfect))
  // B stopped tapping: it died exactly when its circle passed the target
  const expected = rules.deathTime(bot_b.state, rules.targetLayout(match.config))
  assert.ok(Math.abs((await died).t - expected) < 1)

  bot_a.stop()
  bot_b.stop()
  a.emit("room:leave")
  b.emit("room:leave")
})

test("lag compensation is bounded: a late claim is not granted as perfect", async () => {
  const { a, b, match } = await startRoomMatch()
  const bot_a = bot(a, match, { hits: 3 })
  const bot_b = bot(b, match, { hits: 1, send_late_by: 300 })
  const result = await once(b, "player:state", ({ id }) => id === b.id)
  assert.strictEqual(result.perfect === true, false)
  if (result.hit) assert.strictEqual(result.state.score, 1)
  await once(a, "match:end")
  bot_a.stop()
  bot_b.stop()
  a.emit("room:leave")
  b.emit("room:leave")
})

test("a tap claiming a future time is judged at arrival", async () => {
  const { a, b, match } = await startRoomMatch()
  await sleep(match.startAt - Date.now() + 30)
  a.emit("tap", { seq: 1, t: Date.now() + 5000 })
  const result = await once(a, "player:state", ({ id }) => id === a.id)
  assert.strictEqual(result.hit, false)
  const end = await once(b, "match:end")
  assert.strictEqual(end.winner, b.id)
  a.emit("room:leave")
  b.emit("room:leave")
})

test("simultaneous deaths are a draw, rematch starts a new seed", async () => {
  const { a, b, match } = await startRoomMatch()
  const end = await once(a, "match:end")
  assert.strictEqual(end.draw, true)
  assert.strictEqual(end.winner, null)

  const next = await rematch(a, b)
  assert.notStrictEqual(next.seed, match.seed)
  a.emit("room:leave")
  b.emit("room:leave")
})

test("disconnecting during a match loses it", async () => {
  const { a, b, match } = await startRoomMatch()
  await sleep(match.startAt - Date.now() + 100)
  const end = once(b, "match:end")
  a.disconnect()
  const result = await end
  assert.strictEqual(result.winner, b.id)
  assert.strictEqual(result.reason, "disconnect")
  b.emit("room:leave")
})

test("leaving after a match tells the opponent, a new player can take the seat", async () => {
  const { a, b, code } = await startRoomMatch()
  await once(a, "match:end") // nobody taps -> draw
  a.emit("room:rematch")
  const left = once(b, "opponent:left")
  a.emit("room:leave")
  await left

  // alone in the room, a rematch request can't start anything
  b.emit("room:rematch")
  await sleep(100)

  const c = await connect()
  const start = once(b, "match:start")
  assert.deepStrictEqual(await request(c, "room:join", { code }), { code })
  await start
  b.emit("room:leave")
  c.emit("room:leave")
})
