import { createBackground } from "../GUI-helper"
import { IS_SERVER_ALIVE, IS_ONLINE } from "../../shortcuts/requests"

import { START_SERVER_MAINTENANCE_SCENE } from "../../fetch-helper"
const imgPath = "./assets/img"
export default class loader extends Phaser.Scene {
  constructor() {
    super("loader")
    this.skins_amount = 5
  }

  loadImage(name, path) {
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
    this.loadImage("star-bg", "backgrounds")
    this.loadImage("earthquake-bg", "backgrounds")
    this.loadImage("cosmo-bg", "backgrounds")
    this.loadImage("twins-bg", "backgrounds")
    this.loadImage("speed-bg", "backgrounds")
    this.loadImage("time-bg", "backgrounds")
    this.loadImage("perfect-bg", "backgrounds")
    this.loadImage("many-bg", "backgrounds")
    this.loadImage("flower-bg", "backgrounds")
    this.loadImage("hell-bg", "backgrounds")
    this.loadImage("leaderboard-bg", "backgrounds")
    this.loadImage("unstable-bg", "backgrounds")
    this.loadImage("pulsate-bg", "backgrounds")
    this.loadImage("blind-bg", "backgrounds")
    this.loadImage("sense-bg", "backgrounds")
    this.loadImage("tiny-bg", "backgrounds")
    this.loadImage("teleport-bg", "backgrounds")
    this.loadImage("carousel-bg", "backgrounds")
    this.loadImage("threeStep-bg", "backgrounds")
    this.loadImage("oneStep-bg", "backgrounds")
    this.loadImage("black-border", "backgrounds")
  }
  buttons() {
    this.loadImage("pause-button", "buttons")
    this.loadImage("play-button-small", "buttons")
    this.loadImage("play-button-big", "buttons")

    this.loadImage("unmute-button", "buttons")
    this.loadImage("mute-button", "buttons")

    this.loadImage("music-unmute-button", "buttons")
    this.loadImage("music-mute-button", "buttons")

    this.loadImage("customize-button-big", "buttons")

    this.loadImage("arrow-button-blue", "buttons")
    this.loadImage("customize-button", "buttons")
    this.loadImage("home-button", "buttons")
    this.loadImage("home-button-big", "buttons")

    this.loadImage("arrow-button", "buttons")
    this.loadImage("levelSelect-button", "buttons")
    this.loadImage("replay-button", "buttons")
    this.loadImage("close-button", "buttons")
    this.loadImage("next-button", "buttons")
    this.loadImage("tick-button", "buttons")
    this.loadImage("arrow-button-brown", "buttons")
    this.loadImage("circle-button-brown", "buttons")

    this.loadImage("back-button", "buttons")
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
    this.loadImage("lock2", "mix")
    this.loadImage("level-locked", "mix")
    this.loadImage("blue-strap", "mix")
    this.loadImage("red-strap", "mix")
    this.loadImage("purple-strap", "mix")
    this.loadImage("blue-square", "mix")
    this.loadImage("white-strap", "mix")
    this.loadImage("perfect", "mix")
    this.loadImage("star", "mix")
    this.loadImage("ranking-icon", "mix")
    this.loadImage("loading", "mix")
    this.loadImage("glow", "mix")

    this.loadImage("lb-eyes", "mix")
    this.loadImage("lb-bubbles", "mix")
    this.loadImage("lb-face", "mix")
    this.loadImage("lb-aura", "mix")
    this.loadImage("lb-strip", "mix")

    this.loadImage("level-select-decoration-hard", "mix")
    this.loadImage("level-select-difficulty-bar", "mix")
    this.loadImage("level-select-score-bar", "mix")
    this.loadImage("level-select-name-bar", "mix")
    this.loadImage("level-select-score-bar-hard", "mix")
    this.loadImage("level-select-name-bar-hard", "mix")

    this.loadImage("black", "mix")
    this.loadImage("red", "mix")

    this.loadImage("thorns_up", "mix")
    this.loadImage("thorns_sides", "mix")

    this.loadImage("thorns_1", "mix")
    this.loadImage("thorns_2", "mix")
    this.loadImage("thorns_3", "mix")

    this.loadImage("no_internet", "mix")

    this.load.atlas(
      "stars",
      `${imgPath}/mix/stars.png`,
      `${imgPath}/mix/stars.json`
    )
  }
  levelsIcons() {
    this.loadImage("basic_icon", "levelsIcons")
    this.loadImage("wind_icon", "levelsIcons")
    this.loadImage("night_icon", "levelsIcons")
    this.loadImage("snow_icon", "levelsIcons")
    this.loadImage("reverse_icon", "levelsIcons")
    this.loadImage("sun_icon", "levelsIcons")
    this.loadImage("clock_icon", "levelsIcons")
    this.loadImage("earthquake_icon", "levelsIcons")
    this.loadImage("twins_icon", "levelsIcons")
    this.loadImage("speed_icon", "levelsIcons")
    this.loadImage("perfect_icon", "levelsIcons")
    this.loadImage("chameleon_icon", "levelsIcons")
    this.loadImage("expand_icon", "levelsIcons")
    this.loadImage("confusion_icon", "levelsIcons")
    this.loadImage("flower_icon", "levelsIcons")
    this.loadImage("hell_icon", "levelsIcons")
    this.loadImage("teleport_icon", "levelsIcons")
    this.loadImage("unstable_icon", "levelsIcons")
    this.loadImage("pulsate_icon", "levelsIcons")
    this.loadImage("blind_icon", "levelsIcons")
    this.loadImage("sense_icon", "levelsIcons")
    this.loadImage("tiny_icon", "levelsIcons")
    this.loadImage("carousel_icon", "levelsIcons")
    this.loadImage("oneStep_icon", "levelsIcons")
    this.loadImage("threeStep_icon", "levelsIcons")
  }
  loadAssets() {
    this.load.spritesheet("fingers", `${imgPath}/mix/fingers.png`, {
      frameWidth: 240,
      frameHeight: 354,
    })
    this.load.spritesheet("bird", `${imgPath}/bird.png`, {
      frameWidth: 70,
      frameHeight: 39,
    })
    this.load.image("pentagon", `${imgPath}/pentagon.png`)
    this.load.image("flame", `${imgPath}/flame.png`)
    this.load.image("lightning", `${imgPath}/lightning.png`)

    this.load.image("bubble", `${imgPath}/bubble.png`)
    this.load.image("ball", `${imgPath}/ball.png`)
    this.load.atlas("colors", `${imgPath}/colors.png`, `${imgPath}/colors.json`)
    this.load.atlas(
      "particles",
      `${imgPath}/particles.png`,
      `${imgPath}/particles.json`
    )
    this.load.image("levelselect-1", `${imgPath}/levelselect-1.png`)
    this.load.image("levelselect-2", `${imgPath}/levelselect-2.png`)

    this.load.image("menu-1", `${imgPath}/menu-1.png`)
    this.load.image("menu-2", `${imgPath}/menu-2.png`)
    this.load.image("bubbles-menu", `${imgPath}/bubbles-menu.png`)
    this.load.image("bubbles-levelselect", `${imgPath}/bubbles-levelselect.png`)
    this.load.image("price-bg", `${imgPath}/price-bg.png`)
    this.load.atlas("lock", `${imgPath}/lock.png`, `${imgPath}/lock.json`)
    this.load.atlas("boost", `${imgPath}/boost.png`, `${imgPath}/boost.json`)

    this.load.image("circlerisk", `${imgPath}/circlerisk.png`)
    this.load.image("tick", `${imgPath}/tick.png`)
    this.load.image("new-level-unlocked", `${imgPath}/new-level-unlocked.png`)
    this.backgrounds()
    this.buttons()
    this.mix()
    this.levelsIcons()

    for (let i = 1; i <= this.skins_amount; i++) {
      this.circles(i)
      this.sticks(i)
      this.targets(i)
    }
    this.load.image(
      "leaderboard-button-aura",
      `${imgPath}/leaderboard-button-aura.png`
    )
  }

  updateBar(percentage) {
    this.scene.loading_bar.displayWidth = percentage * this.scene.game.GW
  }
  createGUI() {
    createBackground(this, "loading-bg")
    this.loading_bar = this.add
      .image(this.game.GW / 2, this.game.GH - 20, "loading-bar")
      .setOrigin(0.5, 1)
    this.add.image(this.game.GW / 2, 60, "pipcompany")
    this.add.image(this.game.GW / 2, this.game.GH * 0.3, "gentelman")
    this.add
      .image(this.game.GW + 200, this.game.GH + 90, "loading-circle-arm")
      .setOrigin(1, 1)
  }
  preload() {
    this.createGUI()
    this.load.on("progress", this.updateBar)

    this.loadAssets()
  }
  async create() {
    if ((await IS_ONLINE()) && !(await IS_SERVER_ALIVE())) {
      START_SERVER_MAINTENANCE_SCENE(this.game.scene.getScenes(true))
    } else {
      this.scene.start("menu")
    }
  }
}
