import { createButton, sceneTransition } from "../GUI-helper"
import { getProgress } from "../../shortcuts/save"
export default class Lose extends Phaser.Scene {
  constructor() {
    super("lose")
  }
  init(data) {
    this.progress = getProgress()
    this.level_scene = data.scene
    this.elements = []
  }
  create() {
    this.score = this.createScore()
    this.perfect_score = this.createPerfect()
    this.createBest()
    this.createButtons()
  }

  showMenu() {
    this.elements.forEach((el) => el.setVisible(true).setActive(true))
  }

  hideMenu() {
    this.elements.forEach((el) =>
      el.setVisible(false).setActive(false).setDepth(1)
    )
  }

  updatePoints(score, perfect) {
    this.score.setText(score)
    this.perfect_score.setText(perfect)
  }

  createWhiteSquare() {
    const blue_strap = this.add
      .image(this.game.GW / 2, 20, "blue-square")
      .setOrigin(0.5, 0)
    this.elements.push(blue_strap)
  }

  createScore() {
    this.blue_strap = this.add.image(0, 100, "blue-strap").setOrigin(0, 0.5)

    this.blue_strap.displayWidth = this.game.GW

    const a = this.add
      .text(this.game.GW / 2, this.blue_strap.y, "SCORE", {
        font: "60px LuckiestGuy", /// SCORE TEXT
      })
      .setOrigin(0.5)

    const divider = this.add
      .text(this.game.GW / 2, this.blue_strap.y + 90 + 15, "/", {
        font: "50px LuckiestGuy", /// DIVIDER
      })
      .setOrigin(0.5)

    const b = this.add
      .text(
        divider.x - divider.displayWidth / 2,
        this.blue_strap.y + 90, /// CURRENT SCORE
        0,
        {
          font: "90px LuckiestGuy",
        }
      )
      .setOrigin(1, 0.5)

    const c = this.add
      .text(
        divider.x + divider.displayWidth / 2,
        this.blue_strap.y + 90 + 15,
        this.level_scene.score_to_next_level, /// NEEDED SCORE
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0, 0.5)
    this.elements.push(this.blue_strap, a, divider, b, c)
    return b
  }

  createPerfect() {
    const purple_strap = this.add /// PURPLE STRAP
      .image(
        this.game.GW / 2,
        this.blue_strap.y + this.blue_strap.displayHeight / 2 + 200,
        "purple-strap"
      )
      .setOrigin(1, 0.5)

    purple_strap.displayWidth = this.game.GW / 2

    const a = this.add /// PERFECT TEXT
      .text(
        purple_strap.x - purple_strap.displayWidth / 2,
        purple_strap.y,
        "PERFECT",
        {
          font: "45px LuckiestGuy",
        }
      )
      .setOrigin(0.5)

    const b = this.add /// CURRENT PERFECT SCORE
      .text(
        purple_strap.x - purple_strap.displayWidth / 2,
        purple_strap.y + purple_strap.displayHeight / 2 + 30,
        0,
        {
          font: "60px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
    this.elements.push(purple_strap, a, b)
    return b
  }

  createBest() {
    const red_strap = this.add
      .image(
        this.game.GW / 2, /// RED STRAP
        this.blue_strap.y + this.blue_strap.displayHeight / 2 + 200,
        "red-strap"
      )
      .setOrigin(0, 0.5)

    red_strap.displayWidth = this.game.GW / 2

    const a = this.add
      .text(red_strap.x + red_strap.displayWidth / 2, red_strap.y, "BEST", {
        font: "45px LuckiestGuy", /// BEST TEXT
      })
      .setOrigin(0.5)

    const b = this.add
      .text(
        red_strap.x + red_strap.displayWidth / 2,
        red_strap.y + red_strap.displayHeight / 2 + 30,
        this.progress.levels_scores[this.level_scene.level - 1], /// CURRENT BEST SCORE
        {
          font: "60px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
    this.elements.push(red_strap, a, b)
  }

  createButtons() {
    const a = createButton(
      this,
      this.game.GW / 2,
      this.game.GH - 100,
      "ranking-icon",
      () => {
        this.scene.launch("leaderboard", {
          level: this.level_scene.level,
        })

        this.scene.bringToTop("leaderboard")
      }
    )
    const shift = 170
    const b = createButton(
      this,
      this.game.GW / 2 - shift,
      this.game.GH - 100,
      "customize-button",
      () => {
        this.level_scene.scene.stop()
        this.scene.stop()

        this.level_scene.scene.wake("menu")
        this.level_scene.scene.wake("customize")
        this.level_scene.scene.get("customize").animateCustomizeShow()
      }
    )
    const c = createButton(
      this,
      this.game.GW / 2 + shift,
      this.game.GH - 100,
      "levelSelect-button",
      () => {
        this.level_scene.scene.stop()
        this.scene.stop()

        this.level_scene.scene.wake("menu")
        this.level_scene.scene.wake("levelSelect")
        this.level_scene.scene.get("levelSelect").animateLevelSelectShow()
      } //sceneTransition(this.level_scene, "levelSelect")
    )
    this.elements.push(a, b, c)
  }
  createNextLevelButton() {
    const a = createButton(
      this,
      this.game.GW / 2,
      this.game.GH - 240,
      "next-button",
      () => {
        const this_level_configuration =
          levelsConfiguration[this.level_scene.level]
        this.level_scene.scene.start(
          `${this_level_configuration.info.name.capitalize()}_${this_level_configuration.info.difficulty.capitalize()}`,
          {
            config: this_level_configuration.config,
            level: this.level_scene.level + 1,
            score_to_next_level:
              this_level_configuration.info.score_to_next_level,
          }
        )
      }
    ).setDepth(11)

    this.elements.push(a)
  }

  createReplayButton() {
    const a = createButton(
      this,
      this.game.GW / 2,
      this.game.GH - 280,
      "replay-button",
      () => {
        this.level_scene.scene.sleep("lose")
        this.level_scene.scene.restart()
      }
    ).setDepth(11)

    this.elements.push(a)
  }
}
