import { createBackground } from "../GUI-helper"
import { GET_GAME_VERSION } from "../../shortcuts/requests"



const imgPath = "./assets/img"
const audioPath = "./assets/audio"

export default class loader extends Phaser.Scene {
  constructor() {
    super("loader")
    this.skins_amount = 5
  }
init(){
  this.GAME_VERSION_PROMISE =  GET_GAME_VERSION();
}
  loadImage(name, path) {
    this.load.image(name, `${imgPath}/${path}/${name}.png`)
  }
  loadSound(name, path, extension) {
    this.load.audio(name, `${audioPath}/${path}/${name}.${extension}`)
  }
  loadAtlas(name) {
    this.load.atlas(
      `${name}`,
      `${imgPath}/${name}.png`,
      `${imgPath}/${name}.json`
    )
  }
  backgrounds() {
    this.loadImage("ranking-bg", "backgrounds")
    this.loadImage("menu-bg", "backgrounds")
    this.loadImage("levelSelect-bg", "backgrounds")
    this.loadImage("levelSelect-middle", "backgrounds")

    this.loadImage("black-bg", "backgrounds")
 this.loadImage("gray_1", "backgrounds")
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

    this.loadImage("many-bg", "backgrounds")
    this.loadImage("flower-bg", "backgrounds")
    this.loadImage("hell-bg", "backgrounds")

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

  loadAssets() {
    this.backgrounds()
    this.loadAtlas("targets")
    this.loadAtlas("circles")
    this.loadAtlas("sticks")

    this.loadAtlas("levels-icons")
    this.loadAtlas("buttons")
    this.loadAtlas("general-2")

    this.load.atlas(
      "stars",
      `${imgPath}/mix/stars.png`,
      `${imgPath}/mix/stars.json`
    )

    this.load.atlas("colors", `${imgPath}/colors.png`, `${imgPath}/colors.json`)
    this.load.atlas(
      "particles",
      `${imgPath}/particles.png`,
      `${imgPath}/particles.json`
    )


    this.load.spritesheet("fingers", `${imgPath}/mix/fingers.png`, {
      frameWidth: 240,
      frameHeight: 354,
    })
    this.load.spritesheet("bird", `${imgPath}/bird.png`, {
      frameWidth: 70,
      frameHeight: 39,
    })

    /*
    for (let i = 1; i <= this.skins_amount; i++) {
      this.circles(i)
      this.sticks(i)
      this.targets(i)
    }
*/

    this.load.image("pentagon", `${imgPath}/pentagon.png`)
    this.load.image("flame", `${imgPath}/flame.png`)

    this.loadImage("lock2", "mix")
    this.loadImage("black", "mix")
    this.loadImage("pentagon", "mix")
    this.loadImage("pause-bg","mix")

    this.loadImage("buttons-lose-bg", "mix2")
    this.loadImage("score-lose-bg","mix2")
    this.loadImage("lb-me-bar", "mix2")
    this.loadImage("lb-strap", "mix2")
    this.loadImage("lb-scores-bg", "mix2")
    this.loadImage("lb-line", "mix2")
    this.loadImage("ranking-icon", "mix2")

  }

  updateBar(percentage) {
    this.scene.loading_bar.displayWidth = percentage * this.scene.game.GW
  }
  createGUI() {
    createBackground(this, "loading-bg")

    this.loading_bar = this.add
      .image(this.game.GW / 2, this.game.GH - 20, "general-1", "loading-bar")
      .setOrigin(0.5, 1)
    this.add.image(this.game.GW / 2, 60, "general-1", "pipcompany")
    this.add.image(
      this.game.GW / 2,
      this.game.GH * 0.3,
      "general-1",
      "gentelman"
    )
    this.add
      .image(
        this.game.GW + 200,
        this.game.GH + 90,
        "general-1",
        "loading-circle-arm"
      )
      .setOrigin(1, 1)
  }
  loadAudio() {
    this.loadSound("tap", "sound", "mp3")
    this.loadSound("perfect_1", "sound", "ogg")
    this.loadSound("perfect_2", "sound", "ogg")

    this.loadSound("next_level_sound_1", "sound", "ogg")
    this.loadSound("next_level_sound_2", "sound", "ogg")

    this.loadSound("start_sound", "sound", "mp3")
    // this.loadSound("restart_sound", "sound", "ogg")
    this.loadSound("new_level_sound", "sound", "ogg")
    this.loadSound("buy_sound", "sound", "ogg")
    this.loadSound("menu_theme", "music", "ogg")
    this.loadSound("button", "sound", "ogg")
    this.loadSound("change_object", "sound", "ogg")
    this.loadSound("die", "sound", "mp3")
  }

  addAudio() {
    this.game.audio = { sounds: {}, music: {} }

    const addMusic = (name) => {
      return (this.game.audio.music[name] = this.sound.add(name))
    }

    addMusic("menu_theme").setLoop(true)

    const addSound = (name) => {
      return (this.game.audio.sounds[name] = this.sound.add(name))
    }
    //addSound([tap,perfect_1,perfect_2]) // i could do like that but i have to set volume some sounds
    addSound("tap").setVolume(0.8)
    addSound("perfect_1").setVolume(0.75)
    addSound("perfect_2").setVolume(0.75)
    addSound("start_sound").setVolume(0.9)
    addSound("new_level_sound")
    // addSound("restart_sound")
    addSound("buy_sound")
    addSound("die").setVolume(0.25)
    addSound("button")
    addSound("change_object")

    addSound("next_level_sound_1")
    addSound("next_level_sound_2")
  }

  preload() {
    if(window.AndroidFullScreen)AndroidFullScreen.immersiveMode()
    this.createGUI()
    this.load.on("progress", this.updateBar)
    this.loadAudio()
    this.loadAssets()
  }

  async create() {
    this.addAudio()


      this.scene.start("menu",{GAME_VERSION_PROMISE:this.GAME_VERSION_PROMISE})
    
  }
}
