import Manager from "../../main/level-manager.js"
import BasicFunctionsManager from "../basic/functions"
import GhostPlayer from "../../multiplayer/ghost-player"
import LocalPlayer from "../../../multiplayer/local-player"
import { getSession } from "../../../multiplayer/session"
import { serverNow } from "../../../multiplayer/connection"
import roomSettings from "../../../multiplayer/room-settings"

// after a predicted death the server confirms it within DEATH_GRACE + latency;
// no answer means the connection is gone
const SERVER_VERDICT_TIMEOUT = 3000

// Basic level against a ghost opponent. The server is authoritative: LocalPlayer
// predicts each tap so it feels instant, this scene renders and wires events.
export default class Multiplayer_Basic extends Phaser.Scene {
  constructor() {
    super("Multiplayer_Basic")
  }

  init(match) {
    this.match = match
    this.session = getSession()
    this.opponent = match.opponent || {}
    this.level = 0 // not a campaign level
    this.score_to_next_level = 0
    this.not_count_stats = true
    this.is_finished = false
    this.countdown_done = false
    this.countdown_value = null

    this.player = new LocalPlayer(match)

    this.manager = new Manager(this, match.config)
    this.manager.init()
    this.manager.multiplayer = this

    this.basicFunctionsManager = new BasicFunctionsManager(this)
    this.ghost = new GhostPlayer(
      this.manager,
      this.opponent,
      this.player.layout,
      match.config,
      this.player.state
    )
  }

  create() {
    this.manager.create()
    this.manager.next_target = this.player.state.next

    this.manager.createGUI()
    this.basicFunctionsManager.createFlyingCubes()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    // target size setting: the hit window and the sprite scale together
    this.manager.target_array.forEach((target) => target.setScale(this.match.config.target_scale || 1))
    this.manager.setNewTarget()

    this.manager.centerTargets()
    this.manager.showTargets()
    this.ghost.create()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.applyMultiplayerState(this.player.state)
    this.manager.bindInputEvents()
    this.ghost.show()

    this.countdown_text = this.add
      .text(this.game.GW / 2, this.game.GH * 0.2, "", { font: `140px ${main_font}` })
      .setOrigin(0.5)
      .setDepth(1)
    // what the room creator configured, the joining player sees it here first
    this.settings_text = this.add
      .text(this.game.GW / 2, this.game.GH * 0.2 + 110, roomSettings.describeSettings(this.match.settings), {
        font: `30px ${main_font}`,
        align: "center",
        wordWrap: { width: this.game.GW * 0.9 },
      })
      .setOrigin(0.5)
      .setDepth(1)
    this.goal_text = this.add
      .text(this.game.GW / 2, this.game.GH * 0.2, "GOAL!", { font: `120px ${main_font}`, color: "#f1c40f" })
      .setOrigin(0.5)
      .setDepth(1)
      .setVisible(false)

    this.manager.GUI_helper.sceneIntro(this)
    this.bindSessionEvents()
    this.events.once("shutdown", () => clearTimeout(this.verdict_timeout))
  }

  bindSessionEvents() {
    const handlers = {
      "player:state": (message) => this.onPlayerState(message),
      "player:died": (message) => this.onPlayerDied(message),
      "player:finished": (message) => message.id !== this.session.id && this.ghost.finish(),
      "match:end": (result) => this.onMatchEnd(result),
    }
    // events that arrived while this scene was starting
    this.session.replayMatchEvents(handlers)
    this.session.bind(this, {
      ...handlers,
      disconnect: () => this.onMatchEnd({ reason: "connection lost" }),
    })
  }

  updateCountdown() {
    if (this.countdown_done || this.is_finished) return

    const remaining = this.match.startAt - serverNow()
    if (remaining <= 0) {
      this.countdown_done = true
      this.manager.game_started = true
      this.countdown_text.setText("GO!")
      this.tweens.add({ targets: this.countdown_text, alpha: 0, scale: 1.5, duration: 500 })
      this.tweens.add({ targets: this.settings_text, alpha: 0, duration: 500 })
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
    if (this.is_finished) return
    const t = serverNow()
    const prediction = this.player.tap(t)
    if (!prediction) return
    this.session.tap(prediction.seq, t)

    if (!prediction.hit) return this.onFrozen()
    this.manager.showMultiplayerHit(prediction.perfect)
    this.manager.applyMultiplayerState(this.player.state)
    // reached the goal: stop and wait for the server to decide who got there first
    if (this.player.is_finished) this.onFrozen()
  }

  // predicted dead: stop the circle and wait for the server's verdict
  onFrozen() {
    this.drawLocalCircle()
    clearTimeout(this.verdict_timeout)
    this.verdict_timeout = setTimeout(
      () => this.onMatchEnd({ reason: "connection lost" }),
      SERVER_VERDICT_TIMEOUT
    )
  }

  drawLocalCircle() {
    this.manager.rotation_angle = this.player.angleAt(serverNow())
    this.manager.updateCircleStickAngle()
  }

  onPlayerState(message) {
    if (message.id !== this.session.id) {
      this.ghost.setState(message.state)
      this.manager.UI.updateOpponentScoreText(message.state.score)
      return
    }

    const change = this.player.reconcile(message, serverNow())
    if (!change) return
    if (change.gained_hit) this.manager.showMultiplayerHit(change.perfect)
    if (change.unfrozen) clearTimeout(this.verdict_timeout)
    this.manager.applyMultiplayerState(this.player.state)
    if (change.frozen || (change.gained_hit && this.player.is_finished)) this.onFrozen()
    else this.drawLocalCircle()
  }

  onPlayerDied({ id, t }) {
    if (id !== this.session.id) return this.ghost.die(t)
    if (this.player.is_dead) return

    this.player.died(t)
    this.drawLocalCircle()
    this.manager.stopMultiplayerGame(true)
  }

  onMatchEnd({ winner = null, draw = false, scores = {}, reason }) {
    if (this.is_finished) return
    this.is_finished = true
    clearTimeout(this.verdict_timeout)

    const has_won = winner === this.session.id
    // lost without the server confirming our death, e.g. connection lost
    const lost_unconfirmed = !has_won && !draw && !this.player.is_dead && this.manager.game_started
    this.manager.stopMultiplayerGame(lost_unconfirmed)
    ;[this.countdown_text, this.settings_text, this.goal_text].forEach((text) => text.setAlpha(0))

    const scoreOf = (id, fallback) => (scores[id] !== undefined ? scores[id] : fallback)
    this.scene.launch("multiplayerResult", {
      level_scene: this,
      has_won,
      draw,
      reason,
      my_score: scoreOf(this.session.id, this.player.state.score),
      opponent_score: scoreOf(this.opponent.id, this.ghost.score),
      opponent: this.opponent,
      win_score: this.match.config.win_score,
    })
    this.scene.bringToTop("multiplayerResult")
  }

  update() {
    this.updateCountdown()

    if (this.manager.game_started) {
      if (this.player.update(serverNow())) this.onFrozen()
      else this.drawLocalCircle()
    }

    if (!this.is_finished) {
      this.ghost.render()
      // a server correction can still take the goal away, so it's derived every frame
      this.goal_text.setVisible(this.player.is_finished)
    }
  }
}
