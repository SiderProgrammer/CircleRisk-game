import { createBackground, createFetchingAnimation } from "../GUI-helper"

export default class Fetching extends Phaser.Scene {
  constructor() {
    super("fetching")
  }
  init({ x, y, shadow = false }) {
    this.x = x
    this.y = y
    this.shadow = shadow
  }
  create() {
    if (this.shadow) {
      createBackground(this, "black-bg")
    }

    createFetchingAnimation(this, this.x, this.y)
  }
}
