"use strict"
// One authoritative 1v1 match. Clients only send taps; the shared rules decide
// hits, score, next targets and deaths. No tick loop is needed: between taps
// the game is a function of time, so each player only has one timer.
//
// A match ends with the earliest decisive event: a death (that player loses) or,
// with a "first to N" goal, reaching N points (that player wins).
const rules = require("../shared/multiplayer-rules")
const { settingsToConfig } = require("../shared/room-settings")
const { MAX_REWIND, getRewind } = require("./latency")

const COUNTDOWN_MS = 3000
// events are final only after the longest possible rewind has passed, so a late
// (but legitimately earlier) tap of the opponent is still taken into account
const EVENT_GRACE = MAX_REWIND
const DRAW_WINDOW = 1 // ms, events closer than this are simultaneous
// the client's estimate of server time can be a little ahead; a claim slightly in
// the future is no advantage (the circle's path is deterministic), clamping it would
// only cause needless prediction corrections
const CLOCK_TOLERANCE = 20 // ms

class Match {
  // settings: sanitized room settings (shared/room-settings.js)
  constructor(sockets, settings) {
    this.sockets = sockets
    this.settings = settings
    this.config = settingsToConfig(settings)
    this.seed = Math.floor(Math.random() * 2 ** 31).toString(36)
    this.start_at = Date.now() + COUNTDOWN_MS
    this.layout = rules.targetLayout(this.config)
    this.ended = false

    this.players = new Map()
    sockets.forEach((socket) =>
      this.players.set(socket.id, {
        socket,
        state: rules.initialState(this.config, this.seed, this.start_at),
        death_at: null,
        finished_at: null,
        timer: null,
      })
    )
  }

  start() {
    this.players.forEach((player) => {
      const opponent = this.opponentOf(player.socket)
      player.socket.emit("match:start", {
        settings: this.settings,
        config: this.config,
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

  isPlaying(player) {
    return player.death_at === null && player.finished_at === null
  }

  handleTap(socket, { seq, t }) {
    const player = this.players.get(socket.id)
    if (this.ended || !player || !this.isPlaying(player)) return

    const received = Date.now()
    if (received < this.start_at) return

    // trust the claimed tap time only within the lag compensation window
    const claimed = t === null ? received : t
    const tap_time = Math.max(
      Math.min(received + CLOCK_TOLERANCE, Math.max(received - getRewind(socket), claimed)),
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

    if (rules.isFinished(player.state, this.config)) this.markFinished(player, tap_time)
    else this.scheduleDeathCheck(player)
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
    const resolve_at = death_at + EVENT_GRACE
    player.timer = setTimeout(() => {
      this.markDead(player, death_at)
      this.resolve(resolve_at)
    }, Math.max(0, resolve_at - Date.now()))
  }

  scheduleResolve(player, event_at) {
    clearTimeout(player.timer)
    const resolve_at = event_at + EVENT_GRACE
    player.timer = setTimeout(() => this.resolve(resolve_at), Math.max(0, resolve_at - Date.now()))
  }

  markDead(player, death_at) {
    if (!this.isPlaying(player)) return
    player.death_at = death_at
    this.emit("player:died", { id: player.socket.id, t: death_at, score: player.state.score })
    this.scheduleResolve(player, death_at)
  }

  markFinished(player, finished_at) {
    player.finished_at = finished_at
    this.emit("player:finished", { id: player.socket.id, t: finished_at, score: player.state.score })
    this.scheduleResolve(player, finished_at)
  }

  // scheduled_at: timers may fire a fraction of a ms before Date.now() reaches their target
  resolve(scheduled_at = 0) {
    if (this.ended) return
    const now = Math.max(Date.now(), scheduled_at)

    // timers can fire slightly out of order, settle every death that is already certain
    this.players.forEach((player) => {
      if (!this.isPlaying(player)) return
      const death_at = rules.deathTime(player.state, this.layout)
      if (death_at + EVENT_GRACE <= now) this.markDead(player, death_at)
    })

    const events = [...this.players.values()]
      .filter((player) => !this.isPlaying(player))
      .map((player) => ({
        player,
        time: player.finished_at !== null ? player.finished_at : player.death_at,
        won: player.finished_at !== null,
      }))
    if (!events.length) return

    const first = Math.min(...events.map(({ time }) => time))
    const decisive = events.filter(({ time }) => time - first < DRAW_WINDOW)
    if (decisive.length > 1) return this.end({ draw: true, reason: decisive[0].won ? "finished" : "died" })

    const { player, won } = decisive[0]
    const other = this.opponentOf(player.socket)
    const other_id = other ? other.id : null
    this.end(
      won
        ? { winner: player.socket.id, loser: other_id, reason: "finished" }
        : { winner: other_id, loser: player.socket.id, reason: "died" }
    )
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
