import Phaser from "./lib/phaser-full"

import Preloader from "./game/scenes/preloader"
import Loader from "./game/scenes/loader"
import Menu from "./game/scenes/menu"
import LevelSelect from "./game/scenes/levelSelect.js"
import Customize from "./game/scenes/customize.js"

import Level_1 from "./game/levels/level-1"
import Level_2 from "./game/levels/level-2"
import Level_3 from "./game/levels/level-3"
import Level_4 from "./game/levels/level-4"
import Level_5 from "./game/levels/level-5"
import Level_6 from "./game/levels/level-6"
import Level_7 from "./game/levels/level-7"

import { CREATE_ACCOUNT } from "./requests"
import { getProgress, saveProgress } from "./save.js"

const scenes = [
  Preloader,
  Loader,
  Menu,
  LevelSelect,
  Customize,
  Level_1,
  Level_2,
  Level_3,
  Level_4,
  Level_5,
  Level_6,
  Level_7,
]

const targetWidth = 480
const targetHeight = 854

const deviceRatio = window.innerWidth / window.innerHeight

const newRatio = (targetHeight / targetWidth) * deviceRatio

const gameWidth = targetWidth * newRatio
const gameHeight = targetHeight

const config = {
  type: Phaser.WEBGL,
  width: gameWidth,
  height: gameHeight,
  enableDebug: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  render: {
    clearBeforeRender: false,
  },

  scene: scenes,
}

const firstJoin = () => {
  document.querySelector("#first-login").style.display = "block"

  const nickname_input = document.querySelector("#nickname-input")
  const accept_button = document.querySelector("#accept-nickname")

  accept_button.onclick = () => {
    CREATE_ACCOUNT(nickname_input.value)
      .then((response) => {
        if (response.status === 200) {
          saveProgress({ nickname: nickname_input.value })
        }
        return response.json()
      })
      .then((r) => console.log(r))
  }
}

const startGame = () => {
  const game = new Phaser.Game(config)
  game.GW = gameWidth
  game.GH = gameHeight

  if (game.input.touch != null) {
    game.input.mouse.enabled = false
  }
}

window.onload = () => {
  getProgress() === null ? firstJoin() : startGame()
}
