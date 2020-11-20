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
      this.game.GH / 2 - 50,
      "play-button-small",
      () => {
        this.scene.stop()
        scene.scene.resume()
      }
    )

    createButton(
      this,
      this.game.GW / 2 - 150,
      this.game.GH / 2 + 150,
      "home-button-big",
      () => {
        scene.scene.stop()
        this.scene.stop()

        this.scene.get("levelSelect").hideAllElementsInMenuContext()

        scene.scene.wake("menu")
        this.scene.get("menu").showElementsSharedWithLevelSelect()
        this.scene.get("menu").animateShowMenu()
      }
    )

    createButton(
      this,
      this.game.GW / 2 + 150,
      this.game.GH / 2 + 150,
      "levelSelect-button",
      () => {
        scene.scene.stop()
        this.scene.stop()
        scene.scene.wake("menu")

        scene.scene.wake("levelSelect")

        this.scene
          .get("levelSelect")

          .animateLevelSelectShow()
      }
    )
  }
}
