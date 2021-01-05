import Phaser from "./main/lib/phaser-full"

import config from "./main/game/core/game-config"
import accountCreator from "./main/account-creator"
import { getProgress } from "./main/shortcuts/save.js"
import bindPrototypeExtendedFunctions from "./main/prototypes"

bindPrototypeExtendedFunctions()
window.main_font = "luckiestGuy"

window.CLIENT_GAME_VERSION = 1;
window.ADS_COUNT = 0;
window.is_server_alive = true;
window.is_lb_button_clicked = false;
//localStorage.clear()
export const startGame = () => {
  const game = new Phaser.Game(config)
  game.GW = config.width
  game.GH = config.height

  if (!game.device.os.desktop) game.input.mouse.enabled = false
}

window.onload = () => getProgress() === null ? accountCreator() : startGame()
  

