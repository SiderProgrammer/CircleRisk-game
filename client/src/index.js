import Phaser from "./lib/phaser-full"

import config from "./core/game-config"
import accountCreator from "./account-creator"
import { getProgress } from "./shortcuts/save.js"
import {
  START_RECONNECTING_SCENE,
  STOP_RECONNECTING_SCENE,
} from "./fetch-helper"

window.main_font = "luckiestGuy"

export const startGame = () => {
  const game = new Phaser.Game(config)
  game.GW = config.width
  game.GH = config.height

  if (game.input.touch != null) {
    // check if is mobile phone
    game.input.mouse.enabled = false // if mobile, remove double click
  }

  let currentScene = {}

  window.addEventListener("offline", () => {
    currentScene = game.scene.getScenes(true)[0]
    START_RECONNECTING_SCENE(currentScene)
  })

  window.addEventListener("online", () => {
    STOP_RECONNECTING_SCENE(currentScene)
  })
}

window.onload = () => {
  getProgress() === null ? accountCreator() : startGame()
}
