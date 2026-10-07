import Phaser from "./main/lib/phaser-full"

import createConfig from "./main/game/core/game-config"
import accountCreator from "./main/account-creator"
import { getProgress } from "./main/shortcuts/save.js"
import bindPrototypeExtendedFunctions from "./main/prototypes"

bindPrototypeExtendedFunctions()
window.main_font = "luckiestGuy"

window.ADS_COUNT = 0;
window.is_server_alive = true;
window.is_lb_button_clicked = false;
//localStorage.clear()
export const startGame = async () => {
  // canvas text doesn't redraw when a web font arrives late, and the browser only fetches
  // the font once something uses it, so load it before any scene renders text
  if (document.fonts) await document.fonts.load(`50px ${main_font}`).catch(() => {})

  // read the screen size when the game starts, not when the module loads
  const config = createConfig()
  const game = new Phaser.Game(config)
  game.GW = config.width
  game.GH = config.height

  if (!game.device.os.desktop) game.input.mouse.enabled = false
}

window.onload = () => getProgress() === null ? accountCreator() : startGame()
  

