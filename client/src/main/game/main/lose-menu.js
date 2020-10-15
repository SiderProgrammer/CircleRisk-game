import { createButton, sceneTransition } from "../GUI-helper"

export default class LoseMenu {
  constructor(scene) {
    this.scene = scene
    this.elements = []
  }

  createLoseMenu() {
    // this.createWhiteSquare()
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

  update() {
    this.score.setText(this.scene.score)
    this.perfect_score.setText(this.scene.perfect)
  }

  createWhiteSquare() {
    const blue_strap = this.scene.scene.add
      .image(this.scene.GW / 2, 20, "blue-square")
      .setOrigin(0.5, 0)
    this.elements.push(blue_strap)
  }

  createScore() {
    this.blue_strap = this.scene.scene.add
      .image(0, 100, "blue-strap")
      .setOrigin(0, 0.5)

    this.blue_strap.displayWidth = this.scene.GW

    const a = this.scene.scene.add
      .text(this.scene.GW / 2, this.blue_strap.y, "SCORE", {
        font: "60px LuckiestGuy", /// SCORE TEXT
      })
      .setOrigin(0.5)

    const divider = this.scene.scene.add
      .text(this.scene.GW / 2, this.blue_strap.y + 90 + 15, "/", {
        font: "50px LuckiestGuy", /// DIVIDER
      })
      .setOrigin(0.5)

    const b = this.scene.scene.add
      .text(
        divider.x - divider.displayWidth / 2,
        this.blue_strap.y + 90, /// CURRENT SCORE
        this.scene.score,
        {
          font: "90px LuckiestGuy",
        }
      )
      .setOrigin(1, 0.5)

    const c = this.scene.scene.add
      .text(
        divider.x + divider.displayWidth / 2,
        this.blue_strap.y + 90 + 15,
        this.scene.scene.score_to_next_level, /// NEEDED SCORE
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0, 0.5)
    this.elements.push(this.blue_strap, a, divider, b, c)
    return b
  }

  createPerfect() {
    const purple_strap = this.scene.scene.add /// PURPLE STRAP
      .image(
        this.scene.GW / 2,
        this.blue_strap.y + this.blue_strap.displayHeight / 2 + 200,
        "purple-strap"
      )
      .setOrigin(1, 0.5)

    purple_strap.displayWidth = this.scene.GW / 2

    const a = this.scene.scene.add /// PERFECT TEXT
      .text(
        purple_strap.x - purple_strap.displayWidth / 2,
        purple_strap.y,
        "PERFECT",
        {
          font: "45px LuckiestGuy",
        }
      )
      .setOrigin(0.5)

    const b = this.scene.scene.add /// CURRENT PERFECT SCORE
      .text(
        purple_strap.x - purple_strap.displayWidth / 2,
        purple_strap.y + purple_strap.displayHeight / 2 + 30,
        this.scene.perfect,
        {
          font: "60px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
    this.elements.push(purple_strap, a, b)
    return b
  }

  createBest() {
    const red_strap = this.scene.scene.add
      .image(
        this.scene.GW / 2, /// RED STRAP
        this.blue_strap.y + this.blue_strap.displayHeight / 2 + 200,
        "red-strap"
      )
      .setOrigin(0, 0.5)

    red_strap.displayWidth = this.scene.GW / 2

    const a = this.scene.scene.add
      .text(red_strap.x + red_strap.displayWidth / 2, red_strap.y, "BEST", {
        font: "45px LuckiestGuy", /// BEST TEXT
      })
      .setOrigin(0.5)

    const b = this.scene.scene.add
      .text(
        red_strap.x + red_strap.displayWidth / 2,
        red_strap.y + red_strap.displayHeight / 2 + 30,
        this.scene.progress.levels_scores[this.scene.scene.level - 1], /// CURRENT BEST SCORE
        {
          font: "60px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
    this.elements.push(red_strap, a, b)
  }

  createButtons() {
    const a = helper.createButton(
      this.scene.scene,
      this.scene.GW / 2,
      this.scene.GH - 100,
      "ranking-icon",
      () => {
        this.scene.scene.scene.start("leaderboard", {
          level: this.scene.scene.level,
        })
      }
    )
    const shift = 170
    const b = helper.createButton(
      this.scene.scene,
      this.scene.GW / 2 - shift,
      this.scene.GH - 100,
      "customize-button",
      () => helper.sceneTransition(this.scene.scene, "customize")
    )
    const c = helper.createButton(
      this.scene.scene,
      this.scene.GW / 2 + shift,
      this.scene.GH - 100,
      "levelSelect-button",
      () => helper.sceneTransition(this.scene.scene, "levelSelect")
    )
    this.elements.push(a, b, c)
  }
  createNextLevelButton() {
    const a = helper
      .createButton(
        this.scene.scene,
        this.scene.GW / 2,
        this.scene.GH - 240,
        "next-button",
        () => {
          this.scene.scene.scene.start(`level_${this.scene.scene.level + 1}`, {
            config: levelsConfiguration[this.scene.scene.level].config,
            level: this.scene.scene.level + 1,
            score_to_next_level:
              levelsConfiguration[this.scene.scene.level].info
                .score_to_next_level,
          })
        }
      )
      .setDepth(11)

    this.elements.push(a)
  }

  createReplayButton() {
    const a = helper
      .createButton(
        this.scene.scene,
        this.scene.GW / 2,
        this.scene.GH - 280,
        "replay-button",
        () => this.scene.scene.scene.restart()
      )
      .setDepth(11)

    this.elements.push(a)
  }
}
