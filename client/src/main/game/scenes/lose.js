import { createButton } from "../GUI-helper"
import { getProgress } from "../../shortcuts/save"
export default class Lose extends Phaser.Scene {
  constructor() {
    super("lose")
  }
  init(data) {
    this.progress = getProgress()
    this.level_scene = data.scene
    this.are_buttons_active = false
  }
  create() {
    this.score = this.createScore()
    this.createBest()
    this.perfect_score = this.createPerfect()

    this.emptySpace =
      this.game.GH - (this.purple_strap.y + this.purple_strap.displayHeight / 2)
    this.createButtons()
  }

  activateButtons() {
    this.are_buttons_active = true
  }

  unactivateButtons() {
    this.are_buttons_active = false
  }

  updatePoints(score, perfect) {
    this.score.setText(score)
    this.perfect_score.setText(perfect)
    this.best = this.progress.levels_scores[this.level_scene.level - 1];
  }

  createScore() {
    this.blue_strap = this.add.image(0, 0, "blue-strap").setOrigin(0, 0.5)
    this.blue_strap.y += this.blue_strap.displayHeight / 2

    this.add
      .text(50, this.blue_strap.y, "SCORE", {
        font: "60px LuckiestGuy", /// SCORE TEXT
      })
      .setOrigin(0, 0.5)

    const divider = this.add
      .text(this.game.GW - 200, this.blue_strap.y, "/", {
        font: "50px LuckiestGuy", /// DIVIDER
      })
      .setOrigin(0.5)

    const b = this.add
      .text(
        divider.x - divider.displayWidth / 2,
        this.blue_strap.y, /// CURRENT SCORE
        0,
        {
          font: "90px LuckiestGuy",
        }
      )
      .setOrigin(1, 0.5)

    this.add
      .text(
        divider.x + divider.displayWidth / 2,
        this.blue_strap.y + 15,
        this.level_scene.score_to_next_level, /// NEEDED SCORE
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0, 0.5)

    return b
  }

  createBest() {
    this.red_strap = this.add
      .image(
        0, /// RED STRAP
        this.blue_strap.y + this.blue_strap.displayHeight,
        "red-strap"
      )
      .setOrigin(0, 0.5)

    this.add
      .text(50, this.red_strap.y, "BEST", {
        font: "45px LuckiestGuy", /// BEST TEXT
      })
      .setOrigin(0, 0.5)

    this.add
  this.best = this.add.text(
        this.game.GW - 200,
        this.red_strap.y,
        this.progress.levels_scores[this.level_scene.level - 1], /// CURRENT BEST SCORE
        {
          font: "60px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
  }

  createPerfect() {
    this.purple_strap = this.add /// PURPLE STRAP
      .image(0, this.red_strap.y + this.red_strap.displayHeight, "purple-strap")
      .setOrigin(0, 0.5)

    this.add /// PERFECT TEXT
      .text(50, this.purple_strap.y, "PERFECT", {
        font: "45px LuckiestGuy",
      })
      .setOrigin(0, 0.5)

    const b = this.add /// CURRENT PERFECT SCORE
      .text(this.game.GW - 200, this.purple_strap.y, 0, {
        font: "60px LuckiestGuy",
      })
      .setOrigin(0.5)

    return b
  }

  createButtons() {
    const a = createButton(
      this,
      this.game.GW / 2,
      this.game.GH - this.emptySpace / 2 - 150,
      "ranking-icon",
      () => {
        if (!this.are_buttons_active) return
        this.scene.launch("leaderboard", {
          level: this.level_scene.level,
        })

        this.scene.bringToTop("leaderboard")
      }
    ).setDepth(0.1)

    this.add.image(a.x, a.y, "leaderboard-button-aura")

    const shift = 200
    createButton(
      this,
      this.game.GW / 2 - shift,
      this.game.GH - this.emptySpace / 2 + 130,
      "customize-button",
      () => {
        if (!this.are_buttons_active) return
        this.level_scene.scene.stop()
        this.scene.stop()

        this.level_scene.scene.wake("menu")
        this.scene.get("menu").showElementsSharedWithLevelSelect()
        this.scene.get("levelSelect").hideAllElementsInMenuContext()
        this.level_scene.scene.wake("customize")
        this.level_scene.scene.get("customize").animateCustomizeShow()
      }
    )
    createButton(
      this,
      this.game.GW / 2 + shift,
      this.game.GH - this.emptySpace / 2 + 130,
      "levelSelect-button",
      () => {
        if (!this.are_buttons_active) return
        this.level_scene.scene.stop()
        this.scene.stop()

        this.level_scene.scene.wake("menu")
        this.level_scene.scene.wake("levelSelect")
        this.level_scene.scene.get("levelSelect").animateLevelSelectShow()
      } //sceneTransition(this.level_scene, "levelSelect")
    )

    this.createRestartButton()
    this.createNextLevelButton()
  }
  showNextLevelButton() {
    this.next_level_button.setVisible(true).setActive(true)
  }
  showRestartButton() {
    this.restart_button.setVisible(true).setActive(true)
  }

  hideRestartButton() {
    this.restart_button.setVisible(false).setActive(false)
  }
  hideNextLevelButton() {
    this.next_level_button.setVisible(false).setActive(false)
  }
  createNextLevelButton() {
    this.next_level_button = createButton(
      this,
      this.game.GW / 2,
      this.game.GH - this.emptySpace / 2 + 10,
      "next-button",
      () => {
        if (!this.are_buttons_active) return
        this.scene.stop()

        const this_level_configuration =
          levelsConfiguration[this.level_scene.level]
        const { name, difficulty } = this_level_configuration.info

        const level_scene_to_start = `${name.capitalize()}_${difficulty.capitalize()}`

        this.level_scene.scene.start(level_scene_to_start, {
          config: this_level_configuration.config,
          level: this.level_scene.level + 1,
          score_to_next_level:
            this_level_configuration.info.score_to_next_level,
        })

        this.scene
          .get(level_scene_to_start)
          .scene.launch("lose", {
            scene: this.scene.get(level_scene_to_start),
          })
          .bringToTop("lose")
          .sleep("lose")
      }
    )
      .setDepth(11)
      .setActive(false)
      .setVisible(false)
  }

  createRestartButton() {
    this.restart_button = createButton(
      this,
      this.game.GW / 2,
      this.game.GH - this.emptySpace / 2 + 10,
      "replay-button",
      () => {
        if (!this.are_buttons_active) return
        this.level_scene.scene.sleep("lose")
        this.level_scene.scene.restart()
      }
    )
      .setDepth(11)
      .setActive(false)
      .setVisible(false)
  }
}
