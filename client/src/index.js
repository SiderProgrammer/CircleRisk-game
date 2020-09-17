import Phaser from "./lib/phaser-full"

import config from "./core/gameConfig"
import accountCreator from "./accountCreator"
import { getProgress } from "./shortcuts/save.js"

export const startGame = () => {
  const game = new Phaser.Game(config)
  game.GW = config.width
  game.GH = config.height

  if (game.input.touch != null) {
    // check if is mobile phone
    game.input.mouse.enabled = false // if mobile, remove double click
  }
}

window.onload = () => {
  getProgress() === null ? accountCreator() : startGame()
}
