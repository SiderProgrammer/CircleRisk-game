import * as helper from "../helper"
import { CREATE_RECONNECTING_TEXT } from "../../fetch-helper"

export default class Offline extends Phaser.Scene {
  constructor() {
    super("offline")
  }
  init({ x, y }) {
    this.x = x
    this.y = y
  }
  create() {
    helper.createBackground(this, "black-bg")
    this.add.image(this.game.GW / 2, this.game.GH / 2 - 80, "no_internet")
    helper.createFetchingAnimation(this, this.x, this.y)
    CREATE_RECONNECTING_TEXT(this, this.x, this.y - 150)
  }
}
