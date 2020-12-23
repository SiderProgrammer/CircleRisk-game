import { createBackground, createFetchingAnimation } from "../GUI-helper"

export default class Fetching extends Phaser.Scene {
  constructor() {
    super("fetching")
  }
  init({ x, y, shadow = false }) {
    this.x = this.game.GW/2
    this.y = this.game.GH/2
    this.shadow = shadow
  }
  create() {
    if (this.shadow) {
      createBackground(this, "black-bg")
    }

    createFetchingAnimation(this, this.x, this.y)
  }
}
