import Phaser from "./main/lib/phaser-full"

import manageOnlineStatus from "./main/online-status"
import config from "./main/game/core/game-config"
import accountCreator from "./main/account-creator"
import { getProgress } from "./main/shortcuts/save.js"

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

window.main_font = "luckiestGuy"
//localStorage.clear()
export const startGame = () => {
  const game = new Phaser.Game(config)
  game.GW = config.width
  game.GH = config.height

  if (!game.device.os.desktop) game.input.mouse.enabled = false
  manageOnlineStatus(game)
}

window.onload = () => {
  getProgress() === null ? accountCreator() : startGame()
}
