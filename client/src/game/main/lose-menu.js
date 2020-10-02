import * as helper from "../helper"

export default class {
  constructor(scene) {
    this.scene = scene
    this.level_scene = scene.scene
    this.elements = []
  }

  createLoseMenu() {
    this.createWhiteSquare()
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
    const blue_strap = this.level_scene.add
      .image(this.scene.GW / 2, 20, "blue-square")
      .setOrigin(0.5, 0)
    this.elements.push(blue_strap)
  }

  createScore() {
    this.blue_strap = this.level_scene.add
      .image(0, 100, "blue-strap")
      .setOrigin(0, 0.5)

    this.blue_strap.displayWidth = this.scene.GW

    const a = this.level_scene.add
      .text(this.scene.GW / 2, this.blue_strap.y, "SCORE", {
        font: "60px LuckiestGuy", /// SCORE TEXT
      })
      .setOrigin(0.5)

    const divider = this.level_scene.add
      .text(this.scene.GW / 2, this.blue_strap.y + 90 + 15, "/", {
        font: "50px LuckiestGuy", /// DIVIDER
      })
      .setOrigin(0.5)

    const b = this.level_scene.add
      .text(
        divider.x - divider.displayWidth / 2,
        this.blue_strap.y + 90, /// CURRENT SCORE
        this.scene.score,
        {
          font: "90px LuckiestGuy",
        }
      )
      .setOrigin(1, 0.5)

    const c = this.level_scene.add
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
    const purple_strap = this.level_scene.add /// PURPLE STRAP
      .image(
        this.scene.GW / 2,
        this.blue_strap.y + this.blue_strap.displayHeight / 2 + 200,
        "purple-strap"
      )
      .setOrigin(1, 0.5)

    purple_strap.displayWidth = this.scene.GW / 2

    const a = this.level_scene.add /// PERFECT TEXT
      .text(
        purple_strap.x - purple_strap.displayWidth / 2,
        purple_strap.y,
        "PERFECT",
        {
          font: "45px LuckiestGuy",
        }
      )
      .setOrigin(0.5)

    const b = this.level_scene.add /// CURRENT PERFECT SCORE
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
    const red_strap = this.level_scene.add
      .image(
        this.scene.GW / 2, /// RED STRAP
        this.blue_strap.y + this.blue_strap.displayHeight / 2 + 200,
        "red-strap"
      )
      .setOrigin(0, 0.5)

    red_strap.displayWidth = this.scene.GW / 2

    const a = this.level_scene.add
      .text(red_strap.x + red_strap.displayWidth / 2, red_strap.y, "BEST", {
        font: "45px LuckiestGuy", /// BEST TEXT
      })
      .setOrigin(0.5)

    const b = this.level_scene.add
      .text(
        red_strap.x + red_strap.displayWidth / 2,
        red_strap.y + red_strap.displayHeight / 2 + 30,
        this.scene.progress.levels_scores[this.level_scene.level - 1], /// CURRENT BEST SCORE
        {
          font: "60px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
    this.elements.push(red_strap, a, b)
  }

  createButtons() {
    const a = helper.createButton(
      this.level_scene,
      this.scene.GW / 2,
      this.scene.GH - 200,
      "replay-button",
      () => this.level_scene.scene.restart()
    )
    const b = helper.createButton(
      this.level_scene,
      this.scene.GW / 2 - 120,
      this.scene.GH - 100,
      "customize-button",
      () => helper.sceneTransition(this.level_scene, "customize")
    )
    const c = helper.createButton(
      this.level_scene,
      this.scene.GW / 2 + 120,
      this.scene.GH - 100,
      "levelSelect-button",
      () => helper.sceneTransition(this.level_scene, "levelSelect")
    )
    this.elements.push(a, b, c)
  }
}
