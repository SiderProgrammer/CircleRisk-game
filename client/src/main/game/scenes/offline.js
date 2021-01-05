import { createBackground, createFetchingAnimation } from "../GUI-helper"
import { CREATE_RECONNECTING_TEXT } from "../../fetch-helper"

export default class Offline extends Phaser.Scene {
  constructor() {
    super("offline")
  }
  init() {
    this.x = this.game.GW/2
    this.y = this.game.GH/2
  }
  create() {
    createBackground(this, "black-bg")
    this.add.image(this.game.GW / 2, this.game.GH / 2 - 80,"general-1", "no_internet")
    createFetchingAnimation(this, this.x, this.y)
    CREATE_RECONNECTING_TEXT(this, this.x, this.y - 150)
  }
}
