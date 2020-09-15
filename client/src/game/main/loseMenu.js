import helper from "../helper"

export default class {
  constructor(scene) {
    this.scene = scene
  }

  createLoseMenu() {
    this.createWhiteSquare()
    this.createScore()
    this.createPerfect()
    this.createBest()
    this.createButtons()
  }

  createWhiteSquare() {
    this.scene.scene.add
      .image(this.scene.GW / 2, 20, "blue-square")
      .setOrigin(0.5, 0)
  }

  createScore() {
    this.blue_strap = this.scene.scene.add
      .image(0, 100, "blue-strap")
      .setOrigin(0, 0.5)

    this.blue_strap.displayWidth = this.scene.GW

    this.scene.scene.add
      .text(this.scene.GW / 2, this.blue_strap.y, "SCORE", {
        font: "60px LuckiestGuy", /// SCORE TEXT
      })
      .setOrigin(0.5)

    const divider = this.scene.scene.add
      .text(this.scene.GW / 2, this.blue_strap.y + 90 + 15, "/", {
        font: "50px LuckiestGuy", /// DIVIDER
      })
      .setOrigin(0.5)

    this.scene.scene.add
      .text(
        divider.x - divider.displayWidth / 2,
        this.blue_strap.y + 90, /// CURRENT SCORE
        this.scene.score,
        {
          font: "90px LuckiestGuy",
        }
      )
      .setOrigin(1, 0.5)

    this.scene.scene.add
      .text(
        divider.x + divider.displayWidth / 2,
        this.blue_strap.y + 90 + 15,
        this.scene.scene.score_to_next_level, /// NEEDED SCORE
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0, 0.5)
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

    this.scene.scene.add /// PERFECT TEXT
      .text(
        purple_strap.x - purple_strap.displayWidth / 2,
        purple_strap.y,
        "PERFECT",
        {
          font: "45px LuckiestGuy",
        }
      )
      .setOrigin(0.5)

    this.scene.scene.add /// CURRENT PERFECT SCORE
      .text(
        purple_strap.x - purple_strap.displayWidth / 2,
        purple_strap.y + purple_strap.displayHeight / 2 + 30,
        this.scene.perfect,
        {
          font: "60px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
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

    this.scene.scene.add
      .text(red_strap.x + red_strap.displayWidth / 2, red_strap.y, "BEST", {
        font: "45px LuckiestGuy", /// BEST TEXT
      })
      .setOrigin(0.5)

    this.scene.scene.add
      .text(
        red_strap.x + red_strap.displayWidth / 2,
        red_strap.y + red_strap.displayHeight / 2 + 30,
        this.scene.progress.score, /// CURRENT BEST SCORE
        {
          font: "60px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
  }

  createButtons() {
    helper.createButton(
      this.scene.scene,
      this.scene.GW / 2,
      this.scene.GH - 200,
      "replay-button",
      () => this.scene.scene.scene.restart()
    )
    helper.createButton(
      this.scene.scene,
      this.scene.GW / 2 - 120,
      this.scene.GH - 100,
      "customize-button",
      () => helper.sceneTransition(this.scene.scene, "customize")
    )
    helper.createButton(
      this.scene.scene,
      this.scene.GW / 2 + 120,
      this.scene.GH - 100,
      "levelSelect-button",
      () => helper.sceneTransition(this.scene.scene, "levelSelect")
    )
  }
}
