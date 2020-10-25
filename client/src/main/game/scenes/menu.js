import * as helper from "../GUI-helper"
import { saveProgress, getProgress } from "../../shortcuts/save"
import {
  GET_ACCOUNT_PROGRESS,
  GET_CONFIGURATIONS,
} from "../../shortcuts/requests"
import { START_FETCHING_SCENE, STOP_FETCHING_SCENE } from "../../fetch-helper"

export default class menu extends Phaser.Scene {
  constructor() {
    super("menu")
    this.is_everything_fetched = false

    this.tween_duration = 300
  }

  init() {
    this.bubbles = []

    this.hidden_positions_y = {
      logo: 0,
      play_button: 0,
      customize_button: 0,
      music_button: 0,
      sound_button: 0,
    }

    if (!this.is_everything_fetched) {
      START_FETCHING_SCENE(this)
      this.fetchFromServer()
    }
  }

  create() {
    this.createBackground()

    this.createDecorations()

    this.createInstagram()
    this.createPlayButton()
    this.createCustomizeButton()
    this.createMuteButton()
    this.createMusicButton()

    this.createFlyingBubbles()

    this.animateShowMenu()
  }

  update() {
    this.bubbles.forEach((bubble) => {
      bubble.y -= bubble.speedY
      bubble.x += bubble.speedX
    })
  }

  async animateShowMenu() {
    const ease = "Sine"

    this.showInstagram()
    this.showLogo(ease)

    await this.showPlayButton(ease)
    this.showBottomButtons(ease)
  }

  async animateHideMenu() {
    const ease = "Sine.easeIn"

    this.hideInstagram()
    await this.hideButtonsAndLogo(ease)

    return new Promise((resolve) => resolve())
  }

  resetPositionsToHidden() {
    for (const element in this.hidden_positions_y) {
      eval(`this.${[element]}.y = ${this.hidden_positions_y[element]}`)
    }
    return this
  }

  createBackground() {
    this.background = helper.createBackground(this, "menu-bg")
  }

  createDecorations() {
    this.add.image(this.game.GW / 2, this.game.GH / 2, "bubbles-menu")

    this.mountains_big = helper.setGameSize(
      this.add
        .image(this.game.GW / 2, this.game.GH, "menu-2")
        .setOrigin(0.5, 1),
      true
    )
    this.mountains_small = helper.setGameSize(
      this.add
        .image(this.game.GW / 2, this.game.GH, "menu-1")
        .setOrigin(0.5, 1),
      true
    )

    this.logo = this.add
      .image(this.game.GW / 2, this.game.GH, "circlerisk")
      .setOrigin(0.5, 0)
    this.hidden_positions_y.logo = this.logo.y
  }

  createMuteButton() {
    this.sound_button = helper
      .createButton(
        this,
        this.game.GW - 25,
        this.game.GH,
        "mute-button",
        () => {
          this.sound_button.texture.key === "mute-button"
            ? this.sound_button.setTexture("unmute-button")
            : this.sound_button.setTexture("mute-button")
        }
      )

      .setOrigin(1, 1)

    this.sound_button.y += this.sound_button.displayHeight
    this.hidden_positions_y.sound_button = this.sound_button.y
  }

  createMusicButton() {
    this.music_button = helper
      .createButton(
        this,
        this.game.GW / 2,
        this.game.GH,
        "music-mute-button",
        () => {
          this.music_button.texture.key === "music-mute-button"
            ? this.music_button.setTexture("music-unmute-button")
            : this.music_button.setTexture("music-mute-button")
        }
      )

      .setOrigin(0.5, 1)

    this.music_button.y += this.music_button.displayHeight
    this.hidden_positions_y.music_button = this.music_button.y
  }

  createBubble(x, y) {
    const bubble = this.add.image(x, y, "bubble")
    this.bubbles.push(bubble)
    bubble.fly_direction = 1

    bubble.speedY = Phaser.Math.FloatBetween(0.3, 0.8)
    bubble.speedX = Phaser.Math.FloatBetween(0.1, 0.3)

    if (Phaser.Math.Between(0, 1)) bubble.fly_direction = -1

    this.time.addEvent({
      delay: Phaser.Math.Between(1500, 3000),
      loop: true,
      callback: () => {
        bubble.speedX *= -1
      },
    })

    this.time.addEvent({
      delay: Phaser.Math.Between(5000, 30000),
      callback: () => {
        this.tweens.add({
          targets: bubble,
          alpha: 0,
          duration: 1500,
          onComplete: () => bubble.destroy(),
        })
      },
    })

    bubble.setAlpha(0).setScale(Phaser.Math.Between(3, 10) / 10)

    this.tweens.add({ targets: bubble, alpha: 0.6, duration: 300 })

    return bubble
  }

  createFlyingBubbles() {
    for (let i = 0; i < 15; i++) {
      this.createBubble(
        Phaser.Math.Between(0, this.game.GW),
        Phaser.Math.Between(this.game.GH / 2 - 200, this.game.GH - 100)
      )
    }

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callbackScope: this,

      callback: () => {
        this.createBubble(
          Phaser.Math.Between(0, this.game.GW),
          Phaser.Math.Between(this.game.GH - 50, this.game.GH - 150)
        )
      },
    })
  }

  createInstagram() {
    this.instagram_button = helper
      .createButton(this, this.game.GW - 20, 20, "instagram", () => {
        window.open("https://www.instagram.com/pip_games/", "_blank")
      })
      .setOrigin(1, 0)
  }

  createCustomizeButton() {
    this.customize_button = helper
      .createButton(this, 25, this.game.GH, "customize-button", async () => {
        //  helper.sceneTransition(this, "customize")
        await this.animateHideMenu()
        this.scene.launch("customize")
      })

      .setOrigin(0, 1)

    this.customize_button.y += this.customize_button.displayHeight
    this.hidden_positions_y.customize_button = this.customize_button.y
  }

  createPlayButton() {
    this.play_button = helper.createButton(
      this,
      this.game.GW / 2,
      this.game.GH,
      "play-button-big",
      async () => {
        const test = helper
          .createBackground(this, "colors", "blue_1")
          .setAlpha(0)
        this.background.setDepth(0.1)
        helper.createBackground(this, "levelSelect-bg").setDepth(0.15)
        this.mountains_small.setDepth(0.2)
        this.mountains_big.setDepth(0.2)

        this.bubbles.forEach((b) => b.setDepth(0.3))
        await this.animateHideMenu()

        this.scene.launch("levelSelect", {
          mountains: [this.mountains_small, this.mountains_big],
          background: this.background,
          test: test,
        })
      }
    )

    this.play_button.y += this.play_button.displayHeight
    this.hidden_positions_y.play_button = this.play_button.y
  }

  showInstagram() {
    this.instagram_button.setAlpha(0)
    this.tweens.add({
      targets: this.instagram_button,
      alpha: 1,
      duration: 250,
    })
  }

  showLogo(ease) {
    this.tweens.add({
      targets: this.logo,
      y: 70,
      duration: 400,
      ease,
    })
  }

  showPlayButton(ease) {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: this.play_button,
        y: this.game.GH / 2 + 35,
        duration: 400,
        ease,
        onComplete: () => resolve(),
      })
    })
  }

  animateBottomButton(button, ease) {
    this.tweens.add({
      targets: button,
      ease,
      duration: 200,
      y: this.game.GH - 25,
    })
  }

  showBottomButtons(ease) {
    this.animateBottomButton(this.customize_button, ease)

    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.animateBottomButton(this.music_button, ease)
      },
    })

    this.time.addEvent({
      delay: 200,
      callback: () => {
        this.animateBottomButton(this.sound_button, ease)
      },
    })
  }

  hideInstagram() {
    this.tweens.add({
      targets: this.instagram_button,
      alpha: 0,
      duration: 200,
    })
  }

  hideButtonsAndLogo(ease) {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: [
          this.customize_button,
          this.sound_button,
          this.play_button,
          this.music_button,
          this.logo,
        ],
        ease: ease,
        y: `+=${this.game.GH + this.logo.displayHeight / 2}`,
        duration: 200,

        onComplete: () => resolve(),
      })
    })
  }

  async fetchFromServer() {
    try {
      await this.getConfigurations()
      await this.restoreProgress()
      this.finishFetching()
    } catch {
      // if something went wrong, try to fetch again
      setTimeout(() => {
        this.fetchFromServer()
      }, 3000)
    }
  }

  async getConfigurations() {
    const response = await GET_CONFIGURATIONS()
    window.customize_skins_setup = response.skins_setup

    // assign to window because the level select scene can be started by many scenes,
    //not like customize scene which is started only from menu
    // WINDOW ASSIGNED VARIABLES LIKE NICKNAME CAN BE EASY HACKED  !!!
    window.levelsConfiguration = response.levels_config
  }

  async restoreProgress() {
    window.my_nickname = getProgress().nickname

    const progress = await GET_ACCOUNT_PROGRESS({ nickname: my_nickname })

    // converting skin numbers into full name strings
    Object.keys(progress.skins).forEach((item) => {
      progress.skins[item].forEach((skin_number, index, array) => {
        array[index] = item.substring(0, item.length - 1) + "_" + skin_number
      })
    })

    saveProgress(progress)
  }

  finishFetching() {
    this.is_everything_fetched = true
    STOP_FETCHING_SCENE(this)
  }
}
