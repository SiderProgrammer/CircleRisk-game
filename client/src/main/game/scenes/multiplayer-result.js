import { createBackground, createTextButton } from "../GUI-helper"
import { getSession } from "../../multiplayer/session"

const GREY = 0x7f8c8d
const DISABLED = 0x555555

const TITLES = {
  draw: { text: "DRAW", color: "#ecf0f1" },
  won: { text: "YOU WIN!", color: "#f1c40f" },
  lost: { text: "YOU LOSE", color: "#e74c3c" },
}

// why the match ended, when it wasn't simply a death
const REASON_TEXTS = {
  disconnect: "Opponent disconnected",
  left: "Opponent left",
  "connection lost": "Connection lost",
}

// Shown over the finished level: scores, rematch and back to menu.
export default class MultiplayerResult extends Phaser.Scene {
  constructor() {
    super("multiplayerResult")
  }

  init(result) {
    this.result = result
    this.level_scene = result.level_scene
    this.session = getSession()
    this.rematch_requested = false
  }

  create() {
    const { GW, GH } = this.game
    const { has_won, draw, reason, my_score, opponent_score, opponent = {} } = this.result

    const background = createBackground(this, "black-bg").setAlpha(0)
    this.tweens.add({ targets: background, alpha: 0.75, duration: 400 })

    const title = TITLES[draw ? "draw" : has_won ? "won" : "lost"]
    const text = (x, y, content, size, color = "#ffffff") =>
      this.add.text(x, y, content, { font: `${size}px ${main_font}`, color }).setOrigin(0.5)

    this.info_text = text(GW / 2, GH * 0.62, "", 40)
    this.rematch_button = createTextButton(this, GW / 2, GH * 0.72, "REMATCH", () =>
      this.requestRematch(), { color: 0x27ae60 })

    const elements = [
      text(GW / 2, GH * 0.22, title.text, 120, title.color),
      text(GW / 2, GH * 0.22 + 100, (reason !== "died" && REASON_TEXTS[reason]) || "", 40),
      text(GW / 2 - 160, GH * 0.42, "YOU", 50),
      text(GW / 2 - 160, GH * 0.42 + 90, my_score, 110),
      text(GW / 2 + 160, GH * 0.42, opponent.nickname || "OPPONENT", 50, "#bbbbbb"),
      text(GW / 2 + 160, GH * 0.42 + 90, opponent_score, 110, "#bbbbbb"),
      this.info_text,
      this.rematch_button,
      createTextButton(this, GW / 2, GH * 0.72 + 150, "MENU", () => this.backToMenu(), {
        color: GREY,
      }),
    ]
    elements.forEach((element) => element.setAlpha(0))
    this.tweens.add({ targets: elements, alpha: 1, duration: 400, delay: 200 })

    // the opponent may have acted before this scene existed
    if (reason !== "died" || this.session.opponent_left) this.onOpponentGone("Opponent left")
    else if (this.session.opponent_wants_rematch) this.onOpponentRematch()

    this.session.bind(this, {
      "match:start": (match) => {
        this.scene.stop()
        this.level_scene.scene.restart(match)
      },
      "opponent:rematch": () => this.onOpponentRematch(),
      "opponent:left": () => this.onOpponentGone("Opponent left"),
      disconnect: () => this.onOpponentGone("Connection lost"),
    })
  }

  onOpponentRematch() {
    if (!this.rematch_requested) this.info_text.setText("Opponent wants a rematch!")
  }

  // no one to play again with (other end reasons are already shown under the title)
  onOpponentGone(message) {
    if (this.result.reason === "died") this.info_text.setText(message)
    this.rematch_button.setColor(DISABLED).disableInteractive()
  }

  requestRematch() {
    if (this.rematch_requested) return
    this.rematch_requested = true
    this.session.requestRematch()
    this.rematch_button.setColor(DISABLED)
    this.info_text.setText("Waiting for opponent...")
  }

  backToMenu() {
    this.session.leave()
    this.level_scene.scene.stop()
    this.scene.stop()
    this.scene.wake("menu")
    this.scene.get("menu").animateShowMenu()
  }
}
