import * as helper from "../helper"

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
      helper.createBackground(this, "black-bg")
    }

    helper.createFetchingAnimation(this, this.x, this.y)
  }
}
