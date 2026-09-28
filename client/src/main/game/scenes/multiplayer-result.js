import { createBackground, createTextButton } from "../GUI-helper"
import { getSocket } from "../../shortcuts/multiplayer-socket"

export default class MultiplayerResult extends Phaser.Scene {
  constructor() {
    super("multiplayerResult")
  }

  init(data) {
    this.data_ = data
    this.level_scene = data.level_scene
    this.socket = getSocket()
    this.rematch_requested = false
  }

  create() {
    const { GW, GH } = this.game
    const { has_won, draw, reason, my_score, opponent_score, opponent = {} } = this.data_

    const background = createBackground(this, "black-bg").setAlpha(0)
    this.tweens.add({ targets: background, alpha: 0.75, duration: 400 })

    const title = draw
      ? { text: "DRAW", color: "#ecf0f1" }
      : has_won
      ? { text: "YOU WIN!", color: "#f1c40f" }
      : { text: "YOU LOSE", color: "#e74c3c" }

    const elements = []
    elements.push(
      this.add
        .text(GW / 2, GH * 0.22, title.text, {
          font: `120px ${main_font}`,
          color: title.color,
        })
        .setOrigin(0.5)
    )

    const reason_texts = {
      disconnect: "Opponent disconnected",
      left: "Opponent left",
      "connection lost": "Connection lost",
    }
    const is_own_connection_lost = reason === "connection lost"
    elements.push(
      this.add
        .text(GW / 2, GH * 0.22 + 100, (has_won || is_own_connection_lost) && reason_texts[reason] || "", {
          font: `40px ${main_font}`,
        })
        .setOrigin(0.5)
    )

    elements.push(
      this.add.text(GW / 2 - 160, GH * 0.42, "YOU", { font: `50px ${main_font}` }).setOrigin(0.5),
      this.add.text(GW / 2 - 160, GH * 0.42 + 90, my_score, { font: `110px ${main_font}` }).setOrigin(0.5),
      this.add
        .text(GW / 2 + 160, GH * 0.42, opponent.nickname || "OPPONENT", {
          font: `50px ${main_font}`,
          color: "#bbbbbb",
        })
        .setOrigin(0.5),
      this.add
        .text(GW / 2 + 160, GH * 0.42 + 90, opponent_score, {
          font: `110px ${main_font}`,
          color: "#bbbbbb",
        })
        .setOrigin(0.5)
    )

    this.info_text = this.add
      .text(GW / 2, GH * 0.62, "", { font: `40px ${main_font}` })
      .setOrigin(0.5)
    elements.push(this.info_text)

    this.rematch_button = createTextButton(this, GW / 2, GH * 0.72, "REMATCH", () =>
      this.requestRematch(), { color: 0x27ae60 }
    )
    const menu_button = createTextButton(this, GW / 2, GH * 0.72 + 150, "MENU", () =>
      this.backToMenu(), { color: 0x7f8c8d }
    )
    elements.push(this.rematch_button, menu_button)

    // no one to play again with
    if (reason !== "died") this.disableRematch()

    elements.forEach((element) => element.setAlpha(0))
    this.tweens.add({ targets: elements, alpha: 1, duration: 400, delay: 200 })

    this.bindSocketEvents()
  }

  disableRematch() {
    this.rematch_button.setColor(0x555555).disableInteractive()
  }

  requestRematch() {
    if (this.rematch_requested) return
    this.rematch_requested = true
    this.socket.emit("room:rematch")
    this.rematch_button.setColor(0x555555)
    this.info_text.setText("Waiting for opponent...")
  }

  bindSocketEvents() {
    const handlers = {
      "match:start": (match) => {
        this.scene.stop()
        this.level_scene.scene.restart(match)
      },
      "opponent:rematch": () =>
        !this.rematch_requested && this.info_text.setText("Opponent wants a rematch!"),
      "opponent:left": () => {
        this.info_text.setText("Opponent left")
        this.disableRematch()
      },
      disconnect: () => {
        this.info_text.setText("Connection lost")
        this.disableRematch()
      },
    }
    for (const event in handlers) this.socket.on(event, handlers[event])

    this.events.once("shutdown", () => {
      for (const event in handlers) this.socket.off(event, handlers[event])
    })
  }

  backToMenu() {
    this.socket.emit("room:leave")
    this.level_scene.scene.stop()
    this.scene.stop()
    this.scene.wake("menu")
    this.scene.get("menu").animateShowMenu()
  }
}
