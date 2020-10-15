import { createBackground, createButton } from "../GUI-helper"

export default class Pause extends Phaser.Scene {
  constructor() {
    super("pause")
  }
  init({ scene }) {
    createBackground(this, "black-bg")
    createButton(
      this,
      this.game.GW / 2,
      this.game.GH / 2,
      "play-button",
      () => {
        scene.scene.stop("pause")
        scene.scene.resume()
      }
    )

    createButton(
      this,
      this.game.GW / 2 - 150,
      this.game.GH / 2 + 150,
      "home-button",
      () => {
        scene.scene.stop("pause")
        scene.scene.start("menu")
      }
    )

    createButton(
      this,
      this.game.GW / 2 + 150,
      this.game.GH / 2 + 150,
      "levelSelect-button",
      () => {
        scene.scene.stop("pause")

        scene.scene.start("levelSelect", { page: scene.scene.scene.level - 1 })
      }
    )
  }
}
