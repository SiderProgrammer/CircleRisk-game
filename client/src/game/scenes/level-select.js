import * as helper from "../helper.js"
import levelsSettings from "../settings/levels-config"
import { getProgress } from "../../shortcuts/save"
import { GET_LEVEL_SCORES_AND_NICKNAMES } from "../../shortcuts/requests"
import { START_FETCHING_SCENE, STOP_FETCHING_SCENE } from "../../fetch-helper"

export default class levelSelect extends Phaser.Scene {
  constructor() {
    super("levelSelect")
  }

  init(data) {
    this.tints = []
    this.progress = getProgress()

    for (const level in levelsSettings) {
      this.tints.push(levelsSettings[level].info.tint)
    }

    this.actualPageNumber = data.page || 0
    this.canChangePage = true
  }

  create() {
    this.createBackground()

    this.elements = this.createPageElements()

    this.createChangePageButtons()
    this.createHomeButton()

    helper.sceneIntro(this)
  }

  createPageElements() {
    const elements = []

    elements[0] = this.actualPage = this.createPage()

    const pageInfo = this.createPageInfo()

    elements.push(...pageInfo[0], ...pageInfo[1])

    if (this.progress.levels_scores.length >= this.actualPageNumber + 1) {
      elements.push(...this.createPageRequirements())
      elements.push(this.createPageRanking())
    } else {
      elements.push(
        this.add
          .image(this.actualPage.x, this.actualPage.y, "level-locked")
          .setOrigin(0.5, 0)
      )
    }

    elements.push(this.createPageIcon())

    return elements
  }

  createPage() {
    const page = this.add
      .image(this.game.GW / 2, this.game.GH / 2, "levelSelect-middle")
      .setInteractive()
      .on("pointerup", this.pageClickCallback, this)
    return page
  }
  createPageRequirements() {
    let score = this.progress.levels_scores[this.actualPageNumber]
    if (score == null) score = 0

    const text = this.add
      .text(
        this.actualPage.x,
        this.actualPage.y,
        score +
          "/" +
          levelsSettings[this.actualPageNumber].info.score_to_next_level,
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0.5)

    const bar = this.add.image(text.x, text.y, "level-select-score-bar")
    return [text, bar]
  }

  createPageIcon() {
    const icon = levelsSettings[this.actualPageNumber].info.name + "_icon"

    return this.add.image(this.actualPage.x, this.actualPage.y - 80, icon)
  }
  createPageInfo() {
    const texts = []
    const bars = []

    const { difficulty, name } = levelsSettings[this.actualPageNumber].info

    texts[0] = this.add
      .text(
        this.actualPage.x,
        this.actualPage.y - this.actualPage.displayHeight / 2 + 50,
        difficulty,
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0.5)

    texts[1] = this.add
      .text(
        this.actualPage.x,
        this.actualPage.y - this.actualPage.displayHeight / 2 + 100,
        name,
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0.5)

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
      this.actualPage.y + 100,
      "ranking-icon",
      () => {
        START_FETCHING_SCENE(this)
        GET_LEVEL_SCORES_AND_NICKNAMES({
          level: this.actualPageNumber + 1,
          start_search_rank: 1,
          stop_search_rank: 8,
        }).then((data) => {
          console.log(data)
          STOP_FETCHING_SCENE(this)
          this.scene.start("leaderboard", {
            ranks: data,
            level: this.actualPageNumber + 1,
          })
        })
      }
    )
    return button
  }

  pageClickCallback() {
    if (
      !this.canChangePage ||
      this.actualPageNumber > this.progress.levels_scores.length - 1
    )
      return
    const level = this.actualPageNumber + 1
    this.scene.start(`level_${level}`, {
      config: levelsSettings[this.actualPageNumber].config,
      level: level,
      score_to_next_level:
        levelsSettings[this.actualPageNumber].info.score_to_next_level,
    })
  }

  tweenPage(sign) {
    if (!this.canChangePage) return

    let pageShift = -this.game.GW
    this.canChangePage = false

    if (sign == "+") {
      pageShift = this.game.GW
      this.actualPageNumber++
      if (this.actualPageNumber == this.tints.length) this.actualPageNumber = 0
    } else {
      this.actualPageNumber--
      if (this.actualPageNumber == -1)
        this.actualPageNumber = this.tints.length - 1
    }

    const past_page_elements = this.elements

    this.tweens.add({
      targets: past_page_elements,
      x: `${sign}=${this.game.GW}`,
      duration: 500,
      ease: "Bounce.easeOut",
      onStart: () => {
        this.background.setTint(this.tints[this.actualPageNumber])

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
    this.background = helper
      .createBackground(this, "levelSelect-bg")
      .setTint(this.tints[this.actualPageNumber])
  }

  createChangePageButtons() {
    helper.createButton(
      this,
      this.game.GW / 2 - 185,
      this.game.GH / 2,
      "arrow-button",
      () => this.tweenPage("-")
    )

    helper
      .createButton(
        this,
        this.game.GW / 2 + 185,
        this.game.GH / 2,
        "arrow-button",
        () => {
          this.tweenPage("+")
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
