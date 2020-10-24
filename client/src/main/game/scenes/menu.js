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

    if (!this.is_everything_fetched) {
      START_FETCHING_SCENE(this)
      this.fetchFromServer()
    }
  }

  create() {
    helper.createBackground(this, "menu-bg")

    this.createDecorations()
    this.showLogos()

    this.createPlayButton()
    this.createCustomizeButton()
    this.createMuteButton()

    this.createFlyingBubbles()
    helper.sceneIntro(this)
    this.showMenu()
  }

  createDecorations() {
    this.add.image(this.game.GW / 2, this.game.GH / 2, "bubbles-menu")

    helper.setGameSize(
      this.add
        .image(this.game.GW / 2, this.game.GH, "menu-2")
        .setOrigin(0.5, 1),
      true
    )
    helper.setGameSize(
      this.add
        .image(this.game.GW / 2, this.game.GH, "menu-1")
        .setOrigin(0.5, 1),
      true
    )

    this.logo = this.add
      .image(this.game.GW / 2, this.game.GH, "circlerisk")
      .setOrigin(0.5, 0)
  }

  update() {
    this.bubbles.forEach((bubble) => {
      bubble.y -= bubble.speedY
      bubble.x += bubble.speedX
    })
  }
  createMuteButton() {
    this.sound_button = helper
      .createButton(
        this,
        this.game.GW - 25,
        this.game.GH,
        "mute-button",
        () => {}
      )

      .setOrigin(1, 1)

    this.sound_button.y += this.sound_button.displayHeight
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

  showLogos() {
    this.instagram_button = helper
      .createButton(this, this.game.GW - 20, 20, "instagram", () => {
        window.open("https://www.instagram.com/pip_games/", "_blank")
      })
      .setOrigin(1, 0)
  }

  createPlayButton() {
    this.play_button = helper.createButton(
      this,
      this.game.GW / 2,
      this.game.GH,
      "play-button-big",
      () => {
        helper.sceneTransition(this, "levelSelect")
      }
    )

    this.play_button.y += this.play_button.displayHeight
  }

  showMenu() {
    const ease = "Sine"

    this.tweens.add({
      targets: this.logo,

      y: 70,
      duration: 400,
      ease,
    })

    this.tweens.add({
      targets: this.play_button,
      y: this.game.GH / 2 + 35,

      duration: 400,
      ease,
      onComplete: () => {
        this.tweens.add({
          targets: [this.customize_button, this.sound_button],
          ease,
          duration: 200,
          y: this.game.GH - 25,
        })
      },
    })
  }

  hideMenu() {
    this.tweens.add({
      targets: [
        this.customize_button,
        this.sound_button,
        this.play_button,
        this.logo,
      ],
      ease: "Sine.easeIn",
      y: `+=${this.game.GH + this.logo.displayHeight / 2}`,
      duration: 200,
      onComplete: () => {
        this.scene.launch("customize")
      },
    })
  }
  createCustomizeButton() {
    this.customize_button = helper
      .createButton(this, 25, this.game.GH, "customize-button", () => {
        //  helper.sceneTransition(this, "customize")
        this.hideMenu()
        this.scene.launch("customize")
      })

      .setOrigin(0, 1)

    this.customize_button.y += this.customize_button.displayHeight
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

  finishFetching() {
    this.is_everything_fetched = true
    STOP_FETCHING_SCENE(this)
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
}
