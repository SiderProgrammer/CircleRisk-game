import Manager from "../../main/level-manager.js"
import GhostPlayer from "../../main/ghost-player"
import BasicFunctionsManager from "../basic/functions"
import rules from "../../../../../../server/src/shared/multiplayer-rules"
import { getSocket, serverNow } from "../../../shortcuts/multiplayer-socket"

// if the server never confirms a death or the end of the match
const SERVER_VERDICT_TIMEOUT = 3000

// The server is authoritative: it judges every tap and decides deaths.
// This scene predicts the outcome with the same shared rules so taps feel
// instant, and adopts the server's state whenever it arrives.
export default class Multiplayer_Basic extends Phaser.Scene {
  constructor() {
    super("Multiplayer_Basic")
  }

  init(match) {
    this.match = match
    this.opponent = match.opponent
    this.level = match.level
    this.score_to_next_level = match.info.score_to_next_level
    this.not_count_stats = true
    this.is_finished = false
    this.countdown_done = false
    this.countdown_value = null

    this.is_dead = false
    this.frozen_at = null // time the local circle stopped while waiting for the server
    this.tap_seq = 0
    this.corrections = 0 // predictions the server disagreed with, useful for debugging

    this.layout = rules.targetLayout(match.config)
    this.state = rules.initialState(match.config, match.seed, match.startAt)

    this.socket = getSocket()

    this.manager = new Manager(this, match.config)
    this.manager.init()
    this.manager.multiplayer = this

    this.basicFunctionsManager = new BasicFunctionsManager(this)
    this.ghost = new GhostPlayer(this.manager, this.opponent, this.layout, this.state)

    this.bindSocketEvents()
  }

  create() {
    this.manager.create()
    this.manager.next_target = this.state.next

    this.manager.createGUI()
    this.basicFunctionsManager.createFlyingCubes()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    this.manager.showTargets()
    this.ghost.create()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.applyMultiplayerState(this.state)
    this.manager.bindInputEvents()
    this.ghost.show()

    this.countdown_text = this.add
      .text(this.game.GW / 2, this.game.GH * 0.2, "", {
        font: `140px ${main_font}`,
      })
      .setOrigin(0.5)
      .setDepth(1)

    this.manager.GUI_helper.sceneIntro(this)
  }

  bindSocketEvents() {
    const handlers = {
      "player:state": (message) => this.onPlayerState(message),
      "player:died": (message) => this.onPlayerDied(message),
      "match:end": (result) => this.onMatchEnd(result),
      disconnect: () =>
        this.onMatchEnd({ winner: null, reason: "connection lost" }),
    }

    for (const event in handlers) this.socket.on(event, handlers[event])

    this.events.once("shutdown", () => {
      for (const event in handlers) this.socket.off(event, handlers[event])
      clearTimeout(this.verdict_timeout)
    })
  }

  updateCountdown() {
    if (this.countdown_done || this.is_finished) return

    const remaining = this.match.startAt - serverNow()
    if (remaining <= 0) {
      this.countdown_done = true
      this.manager.game_started = true
      this.countdown_text.setText("GO!")
      this.tweens.add({
        targets: this.countdown_text,
        alpha: 0,
        scale: 1.5,
        duration: 500,
      })
      return
    }

    const value = Math.ceil(remaining / 1000)
    if (value !== this.countdown_value) {
      this.countdown_value = value
      this.countdown_text.setText(value).setScale(1.3)
      this.tweens.add({ targets: this.countdown_text, scale: 1, duration: 250 })
    }
  }

  // called by Manager.changeBall
  onTap() {
    if (this.frozen_at !== null || this.is_finished) return

    const t = serverNow()
    this.socket.emit("tap", { seq: ++this.tap_seq, t })

    const result = rules.evaluateTap(
      this.state,
      t,
      this.layout,
      this.match.config,
      this.match.seed
    )
    if (!result.hit) return this.freeze(result.death_at)

    this.manager.showMultiplayerHit(result.perfect)
    this.state = result.state
    this.manager.applyMultiplayerState(this.state)
  }

  // the local prediction says we're dead, stop and let the server confirm
  freeze(time) {
    this.frozen_at = time
    this.manager.rotation_angle = rules.angleAt(this.state, time)
    this.manager.updateCircleStickAngle()

    clearTimeout(this.verdict_timeout)
    this.verdict_timeout = setTimeout(
      () => this.onMatchEnd({ winner: null, reason: "connection lost" }),
      SERVER_VERDICT_TIMEOUT
    )
  }

  onPlayerState({ id, hit, perfect, state }) {
    if (id !== this.socket.id) {
      this.ghost.setState(state)
      this.manager.UI.updateOpponentScoreText &&
        this.manager.UI.updateOpponentScoreText(state.score)
      return
    }

    // a miss is followed by player:died, older confirmations are superseded by our own predictions
    if (!hit || this.is_dead || state.hits < this.state.hits) return

    const predicted = this.state
    const differs =
      state.hits !== predicted.hits ||
      state.score !== predicted.score ||
      Math.abs(state.t0 - predicted.t0) > 0.5

    if (!differs) return

    this.corrections++
    if (state.hits > predicted.hits) this.manager.showMultiplayerHit(perfect)
    this.state = state
    // the server accepted a tap we predicted as a miss
    if (this.frozen_at !== null) {
      this.frozen_at = null
      clearTimeout(this.verdict_timeout)
    }
    this.manager.applyMultiplayerState(state)
  }

  onPlayerDied({ id, t }) {
    if (id !== this.socket.id) return this.ghost.die(t)
    if (this.is_dead) return

    this.is_dead = true
    if (this.frozen_at === null) this.freeze(t)
    this.manager.stopMultiplayerGame(true)
  }

  onMatchEnd({ winner, draw, scores = {}, reason }) {
    if (this.is_finished) return
    this.is_finished = true
    clearTimeout(this.verdict_timeout)

    const has_won = winner === this.socket.id
    if (!has_won && !this.is_dead && this.manager.game_started)
      this.manager.stopMultiplayerGame(true) // e.g. connection lost
    else this.manager.stopMultiplayerGame(false)
    this.countdown_text.setAlpha(0)

    const opponent_id = this.opponent && this.opponent.id
    this.scene.launch("multiplayerResult", {
      level_scene: this,
      has_won,
      draw,
      reason,
      my_score:
        scores[this.socket.id] !== undefined ? scores[this.socket.id] : this.state.score,
      opponent_score:
        scores[opponent_id] !== undefined ? scores[opponent_id] : this.ghost.state.score,
      opponent: this.opponent,
    })
    this.scene.bringToTop("multiplayerResult")
  }

  update() {
    this.updateCountdown()

    if (this.manager.game_started && this.frozen_at === null) {
      const now = serverNow()
      const death_at = rules.deathTime(this.state, this.layout)
      if (now >= death_at) this.freeze(death_at)
      else {
        this.manager.rotation_angle = rules.angleAt(this.state, now)
        this.manager.updateCircleStickAngle()
      }
    }

    if (!this.is_finished) this.ghost.render()
  }
}
