import * as helper from "../helper.js"

import { getProgress } from "../../shortcuts/save"

export default class levelSelect extends Phaser.Scene {
  constructor() {
    super("levelSelect")
  }

  init({ page }) {
    // this.tints = []
    this.progress = getProgress()
    /*
    for (const level in levelsConfiguration) {
      this.tints.push(levelsConfiguration[level].info.tint)
    }
*/
    this.pages_amount = levelsConfiguration.length

    this.current_page_number = page || this.progress.levels_scores.length - 1
    if (page === 0) this.current_page_number = 0 // 0 is false
    this.canChangePage = true
  }

  create() {
    this.createBackground()
    this.thorns = this.createThorns()
    this.hideThorns()
    this.elements = this.createPageElements()

    this.createChangePageButtons()
    this.createHomeButton()

    helper.sceneIntro(this)
  }

  createThorns() {
    const thorns_up = this.add
      .image(0, 0, "thorns_up")
      .setOrigin(0, 0)
      .setFlipY(true)
    helper.setGameSize(thorns_up, true)

    const thorns_down = this.add
      .image(0, this.game.GH, "thorns_up")
      .setOrigin(0, 1)

    helper.setGameSize(thorns_down, true)

    const thorns_left = this.add.image(0, 0, "thorns_sides").setOrigin(0, 0)

    helper.setGameSize(thorns_left, false, true)

    const thorns_right = this.add
      .image(this.game.GW, 0, "thorns_sides")
      .setOrigin(1, 0)
      .setFlipX(true)
    helper.setGameSize(thorns_right, false, true)

    return [thorns_up, thorns_left, thorns_right, thorns_down]
  }

  hideThorns() {
    this.thorns.forEach((thorn) => thorn.setVisible(false))
  }

  showThorns() {
    this.thorns.forEach((thorn) => thorn.setVisible(true))
  }

  createPageElements() {
    const elements = []

    elements[0] = this.actualPage = this.createPage()

    const pageInfo = this.createPageInfo()

    elements.push(...pageInfo[0], ...pageInfo[1])

    if (this.progress.levels_scores.length >= this.current_page_number + 1) {
      elements.push(...this.createPageRequirements())
      elements.push(this.createPageRanking())
    } else {
      elements.push(this.createLevelLock())
    }

    elements.push(this.createPageIcon())

    const difficulty =
      levelsConfiguration[this.current_page_number].info.difficulty

    if (difficulty === "hard" || difficulty === "medium") {
      this.showThorns()
    } else {
      this.hideThorns()
    }

    return elements
  }

  createLevelLock() {
    return this.add
      .image(this.actualPage.x, this.actualPage.y, "level-locked")
      .setOrigin(0.5, 0)
  }

  createPage() {
    const page = this.add
      .image(this.game.GW / 2, this.game.GH / 2, "levelSelect-middle")
      .setInteractive()
      .on("pointerup", this.pageClickCallback, this)
    return page
  }
  createPageRequirements() {
    let score = this.progress.levels_scores[this.current_page_number]
    if (score == null) score = 0
    /*
    const text = this.add
      .text(
        this.actualPage.x,
        this.actualPage.y,
        score +
          "/" +
          levelsConfiguration[this.current_page_number].info.score_to_next_level,
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
      .setDepth(0.1)
*/

    const bar = this.add.image(
      this.actualPage.x,
      this.actualPage.y,
      "level-select-score-bar"
    )

    const divider = this.add
      .text(this.actualPage.x, this.actualPage.y + 15, "/", {
        font: "50px LuckiestGuy", /// DIVIDER
      })
      .setOrigin(0.5)

    const current_score = this.add
      .text(
        divider.x - divider.displayWidth / 2,
        divider.y - 10, /// CURRENT SCORE
        score,
        {
          font: "80px LuckiestGuy",
        }
      )
      .setOrigin(1, 0.5)

    const score_to_reach = this.add
      .text(
        divider.x + divider.displayWidth / 2,
        divider.y,
        levelsConfiguration[this.current_page_number].info.score_to_next_level, /// NEEDED SCORE
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0, 0.5)

    return [current_score, score_to_reach, divider, bar]
  }

  createPageIcon() {
    const icon =
      levelsConfiguration[this.current_page_number].info.name + "_icon"

    return this.add.image(this.actualPage.x, this.actualPage.y - 80, icon)
  }
  createPageInfo() {
    const texts = []
    const bars = []

    const { difficulty, name } = levelsConfiguration[
      this.current_page_number
    ].info

    texts[0] = this.add
      .text(
        this.actualPage.x,
        this.actualPage.y - this.actualPage.displayHeight / 2 + 70,
        difficulty,
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
      .setDepth(0.1)

    texts[1] = this.add
      .text(
        this.actualPage.x,
        this.actualPage.y - this.actualPage.displayHeight / 2 + 220,
        name,
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
      .setDepth(0.1)

    bars[0] = this.add.image(
      texts[0].x,
      texts[0].y,
      "level-select-difficulty-bar"
    )

    bars[1] = this.add.image(texts[1].x, texts[1].y, "level-select-name-bar")

    return [texts, bars]
  }

  createPageRanking() {
    const button = helper.createButton(
      this,
      this.actualPage.x,
      this.actualPage.y + 250,
      "ranking-icon",
      () => {
        this.scene.start("leaderboard", {
          level: this.current_page_number + 1,
        })
      }
    )
    return button
  }

  pageClickCallback() {
    if (
      !this.canChangePage ||
      this.current_page_number > this.progress.levels_scores.length - 1
    )
      return
    const level = this.current_page_number + 1
    this.scene.start(`level_${level}`, {
      config: levelsConfiguration[this.current_page_number].config,
      level: level,
      score_to_next_level:
        levelsConfiguration[this.current_page_number].info.score_to_next_level,
    })
  }

  tweenPage(sign) {
    if (!this.canChangePage) return

    let pageShift = -this.game.GW
    this.canChangePage = false

    if (sign == "+") {
      pageShift = this.game.GW
      this.current_page_number--
      if (this.current_page_number == -1)
        this.current_page_number = this.pages_amount - 1
    } else {
      this.current_page_number++
      if (this.current_page_number == this.pages_amount)
        this.current_page_number = 0
    }

    const past_page_elements = this.elements

    this.tweens.add({
      targets: past_page_elements,
      x: `${sign}=${this.game.GW}`,
      duration: 500,
      ease: "Bounce.easeOut",
      onStart: () => {
        // this.background.setTint(this.tints[this.current_page_number])

        this.elements = this.createPageElements()

        this.elements.forEach((t) => (t.x -= pageShift))

        this.tweens.add({
          targets: this.elements,
          x: `${sign}=${this.game.GW}`,
          duration: 500,
          ease: "Bounce.easeOut",
        })
      },
      onComplete: () => {
        past_page_elements.forEach((t) => t.destroy())

        this.canChangePage = true
      },
    })
  }
  createBackground() {
    helper.createBackground(this, "red") // levelsConfiguration[this.current_page_number].page_color AND ATLAS AFTER COMMA ,
    this.background = helper.createBackground(this, "levelSelect-bg")
    // .setTint(this.tints[this.current_page_number])
  }

  createChangePageButtons() {
    let shift = 275
    helper.createButton(
      this,
      this.game.GW / 2 - shift,
      this.game.GH / 2,
      "arrow-button",
      () => this.tweenPage("+")
    )

    helper
      .createButton(
        this,
        this.game.GW / 2 + shift,
        this.game.GH / 2,
        "arrow-button",
        () => {
          this.tweenPage("-")
        }
      )
      .setFlipX(true)
  }

  createHomeButton() {
    helper
      .createButton(this, 10, 10, "home-button", () => this.scene.start("menu"))
      .setOrigin(0)
  }
}
