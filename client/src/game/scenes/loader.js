import { saveProgress, getProgress } from "../../shortcuts/save"
import {
  GET_ACCOUNT_PROGRESS,
  GET_CUSTOMIZE_SKINS_SETUP,
} from "../../shortcuts/requests"

export default class loader extends Phaser.Scene {
  constructor() {
    super("loader")
    this.skins_amount = 4
  }
  restoreProgress() {
    const local_progress = getProgress()
    GET_CUSTOMIZE_SKINS_SETUP()
    GET_ACCOUNT_PROGRESS({ nickname: local_progress.nickname }).then(
      (progress) => {
        // converting skin numbers into full name strings
        Object.keys(progress.skins).forEach((item) => {
          progress.skins[item].forEach((skin_number, index, array) => {
            array[index] =
              item.substring(0, item.length - 1) + "_" + skin_number
          })
        })

        console.log(progress)
        saveProgress(progress)
      }
    )
  }

  loadImage(name, path) {
    const imgPath = "./assets/img"
    this.load.image(name, `${imgPath}/${path}/${name}.png`)
  }
  backgrounds() {
    this.loadImage("menu-bg", "backgrounds")
    this.loadImage("levelSelect-bg", "backgrounds")
    this.loadImage("levelSelect-middle", "backgrounds")
    this.loadImage("customize-bg", "backgrounds")
    this.loadImage("black-bg", "backgrounds")

    this.loadImage("basic-bg", "backgrounds")
    this.loadImage("autumn-bg", "backgrounds")
    this.loadImage("sunny-bg", "backgrounds")
    this.loadImage("reverse-bg", "backgrounds")
    this.loadImage("night-bg", "backgrounds")
    this.loadImage("snow-bg", "backgrounds")
    this.loadImage("purple-bg", "backgrounds")
    this.loadImage("earthquake-bg", "backgrounds")
  }
  buttons() {
    this.loadImage("play-button", "buttons")
    this.loadImage("customize-button", "buttons")
    this.loadImage("home-button", "buttons")
    this.loadImage("arrow-button", "buttons")
    this.loadImage("levelSelect-button", "buttons")
    this.loadImage("replay-button", "buttons")
    this.loadImage("close-button", "buttons")
    this.loadImage("tick-button", "buttons")
  }
  sticks(i) {
    this.loadImage("stick_" + i, "sticks")
  }
  circles(i) {
    this.loadImage("circle_" + i, "circles")
  }
  targets(i) {
    this.loadImage("target_" + i, "targets")
    this.loadImage("targetToCatch_" + i, "targets")
  }
  mix() {
    this.loadImage("top-bar", "mix")
    this.loadImage("shop-top-bar", "mix")
    this.loadImage("instagram", "mix")
    this.loadImage("geometrytrinity", "mix")
    this.loadImage("coin", "mix")
    this.loadImage("lock", "mix")
    this.loadImage("level-locked", "mix")
    this.loadImage("blue-strap", "mix")
    this.loadImage("red-strap", "mix")
    this.loadImage("purple-strap", "mix")
    this.loadImage("blue-square", "mix")
    this.loadImage("perfect", "mix")
    this.loadImage("star", "mix")
    this.loadImage("ranking-icon", "mix")

    this.loadImage("level-select-difficulty-bar", "mix")
    this.loadImage("level-select-score-bar", "mix")
    this.loadImage("level-select-name-bar", "mix")
  }
  levelsIcons() {
    this.loadImage("basic_icon", "levelsIcons")
    this.loadImage("wind_icon", "levelsIcons")
    this.loadImage("night_icon", "levelsIcons")
    this.loadImage("snow_icon", "levelsIcons")
    this.loadImage("reverse_icon", "levelsIcons")
    this.loadImage("sun_icon", "levelsIcons")

    this.loadImage("earthquake_icon", "levelsIcons")
  }

  preload() {
    this.restoreProgress()

    this.backgrounds()
    this.buttons()
    this.mix()
    this.levelsIcons()

    for (let i = 1; i <= this.skins_amount; i++) {
      this.circles(i)
      this.sticks(i)
      this.targets(i)
    }
    this.loadImage("menu-stick-blue", "sticks")
    this.loadImage("menu-stick-yellow", "sticks")
  }
  create() {
    this.scene.start("menu")
  }
}
