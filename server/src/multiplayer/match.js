"use strict"
// One authoritative 1v1 match. Clients only send taps; the shared rules decide
// hits, score, next targets and deaths. No tick loop is needed: between taps
// the game is a function of time, so each player only has one death timer.
const rules = require("../shared/multiplayer-rules")
const { MAX_REWIND, getRewind } = require("./latency")

const COUNTDOWN_MS = 3000
// deaths are final only after the longest possible rewind has passed, so a late
// (but legitimately earlier) tap or death of the opponent is still taken into account
const DEATH_GRACE = MAX_REWIND
const DRAW_WINDOW = 1 // ms, deaths closer than this are simultaneous

class Match {
  // level: { level, difficulty, info, config } from levels-config
  constructor(sockets, level) {
    this.sockets = sockets
    this.level = level
    this.config = level.config
    this.seed = Math.floor(Math.random() * 2 ** 31).toString(36)
    this.start_at = Date.now() + COUNTDOWN_MS
    this.layout = rules.targetLayout(this.config)
    this.ended = false

    this.players = new Map()
    sockets.forEach((socket) =>
      this.players.set(socket.id, {
        socket,
        state: rules.initialState(this.config, this.seed, this.start_at),
        alive: true,
        death_at: null,
        timer: null,
      })
    )
  }

  start() {
    const { level, difficulty, info, config } = this.level
    this.players.forEach((player) => {
      const opponent = this.opponentOf(player.socket)
      player.socket.emit("match:start", {
        level,
        difficulty,
        info,
        config,
        seed: this.seed,
        startAt: this.start_at,
        opponent: opponent && { id: opponent.id, ...opponent.data.profile },
      })
      this.scheduleDeathCheck(player)
    })
  }

  opponentOf(socket) {
    return this.sockets.find((other) => other !== socket)
  }

  emit(event, data) {
    this.sockets.forEach((socket) => socket.emit(event, data))
  }

  handleTap(socket, { seq, t }) {
    const player = this.players.get(socket.id)
    if (this.ended || !player || !player.alive) return

    const received = Date.now()
    if (received < this.start_at) return

    // trust the claimed tap time only within the lag compensation window
    const claimed = t === null ? received : t
    const tap_time = Math.max(
      Math.min(received, Math.max(received - getRewind(socket), claimed)),
      this.start_at,
      player.state.t0
    )

    const result = rules.evaluateTap(player.state, tap_time, this.layout, this.config, this.seed)

    if (!result.hit) {
      this.emit("player:state", { id: socket.id, seq, hit: false, state: player.state })
      return this.markDead(player, result.death_at)
    }

    player.state = result.state
    this.emit("player:state", {
      id: socket.id,
      seq,
      hit: true,
      perfect: result.perfect,
      state: player.state,
    })
    this.scheduleDeathCheck(player)
  }

  // leaving or disconnecting during a match loses it
  forfeit(socket, reason) {
    const player = this.players.get(socket.id)
    if (this.ended || !player) return
    this.markDead(player, Date.now())
    const winner = this.opponentOf(socket)
    this.end({ winner: winner ? winner.id : null, loser: socket.id, reason })
  }

  // a player who doesn't tap dies when the circle passes the target
  scheduleDeathCheck(player) {
    clearTimeout(player.timer)
    const death_at = rules.deathTime(player.state, this.layout)
    const resolve_at = death_at + DEATH_GRACE
    player.timer = setTimeout(() => {
      this.markDead(player, death_at)
      this.resolve(resolve_at)
    }, Math.max(0, resolve_at - Date.now()))
  }

  markDead(player, death_at) {
    if (!player.alive) return
    player.alive = false
    player.death_at = death_at
    clearTimeout(player.timer)

    this.emit("player:died", { id: player.socket.id, t: death_at, score: player.state.score })

    // decide once nothing that happened before this death can arrive anymore
    const resolve_at = death_at + DEATH_GRACE
    player.timer = setTimeout(() => this.resolve(resolve_at), Math.max(0, resolve_at - Date.now()))
  }

  // scheduled_at: timers may fire a fraction of a ms before Date.now() reaches their target
  resolve(scheduled_at = 0) {
    if (this.ended) return
    const now = Math.max(Date.now(), scheduled_at)

    // timers can fire slightly out of order, settle every death that is already certain
    this.players.forEach((player) => {
      if (!player.alive) return
      const death_at = rules.deathTime(player.state, this.layout)
      if (death_at + DEATH_GRACE <= now) this.markDead(player, death_at)
    })

    const dead = [...this.players.values()].filter(({ alive }) => !alive)
    if (!dead.length) return

    const first_death = Math.min(...dead.map(({ death_at }) => death_at))
    const losers = dead.filter(({ death_at }) => death_at - first_death < DRAW_WINDOW)
    if (losers.length > 1) return this.end({ draw: true, reason: "died" })

    const loser = losers[0].socket
    const winner = this.opponentOf(loser)
    this.end({ winner: winner ? winner.id : null, loser: loser.id, reason: "died" })
  }

  end({ winner = null, loser = null, draw = false, reason }) {
    if (this.ended) return
    this.ended = true
    this.players.forEach((player) => clearTimeout(player.timer))

    const scores = {}
    this.players.forEach((player, id) => (scores[id] = player.state.score))
    this.emit("match:end", { winner, loser, draw, scores, reason })
  }
}

module.exports = Match
