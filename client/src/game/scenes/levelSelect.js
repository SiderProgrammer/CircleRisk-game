import helper from "../helper.js"
import levelsInfo from "../settings/levelsInfo"
import progress from "../settings/progress.js"
import { GET_LEVEL_SCORES_AND_NICKNAMES } from "../../shortcuts/requests"

import LeaderBoardManager from "../main/leaderboard"

export default class levelSelect extends Phaser.Scene {
  constructor() {
    super("levelSelect")
  }

  init() {
    this.tints = []

    for (const level in levelsInfo) {
      this.tints.push(levelsInfo[level].tint)
    }

    this.actualPageNumber = 0
    this.canChangePage = true
  }

  create() {
    this.createBackground()

    this.actualPage = this.createPage()
    this.actualPageText = this.createPageRequirements()
    this.actualPageInfo = this.createPageInfo()
    this.actualRankingIcon = this.createPageRanking()
    this.createChangePageButtons()
    this.createHomeButton()

    helper.sceneIntro(this)
  }

  createPage() {
    const page = this.add
      .image(this.game.GW / 2, this.game.GH / 2, "levelSelect-middle")
      .setInteractive()
      .on("pointerup", this.pageClickCallback, this)
    return page
  }
  createPageRequirements() {
    const level = "level_" + (this.actualPageNumber + 1)

    if (!progress.levels[level]) {
      progress.levels[level] = {
        score: 0,
      }
    }

    const text = this.add
      .text(
        this.actualPage.x,
        this.actualPage.y,
        progress.levels[level].score +
          "/" +
          levelsInfo[level].score_to_next_level,
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
    return text
  }

  createPageInfo() {
    const level = "level_" + (this.actualPageNumber + 1)
    const texts = []
    const { difficulty, name } = levelsInfo[level]

    texts[0] = this.add
      .text(this.actualPage.x, this.actualPage.y - 100, difficulty, {
        font: "50px LuckiestGuy",
      })
      .setOrigin(0.5)

    texts[1] = this.add
      .text(this.actualPage.x, this.actualPage.y - 180, name, {
        font: "50px LuckiestGuy",
      })
      .setOrigin(0.5)

    return texts
  }

  createPageRanking() {
    const button = helper.createButton(
      this,
      this.actualPage.x,
      this.actualPage.y + 100,
      "ranking-icon",
      () => {
        GET_LEVEL_SCORES_AND_NICKNAMES(this.actualPageNumber + 1).then(
          (data) => {
            console.log(data)

            new LeaderBoardManager(this).createLeaderBoard(data)
          }
        )
      }
    )
    return button
  }

  pageClickCallback() {
    if (!this.canChangePage) return
    const level = this.actualPageNumber + 1
    this.scene.start(`level_${level}`, {
      level: level,
      score_to_next_level:
        levelsInfo["level_" + (this.actualPageNumber + 1)].score_to_next_level,
    })
  }

  tweenPage(sign) {
    if (!this.canChangePage) return
    let newPage, newText, newInfo, newRanking
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

    const targets = [
      this.actualPage,
      this.actualPageText,
      ...this.actualPageInfo,
      this.actualRankingIcon,
    ]

    this.tweens.add({
      targets: targets,
      x: `${sign}=${this.game.GW}`,
      duration: 500,
      ease: "Bounce.easeOut",
      onStart: () => {
        this.background.setTint(this.tints[this.actualPageNumber])

        newPage = this.createPage()
        newText = this.createPageRequirements()
        newInfo = this.createPageInfo()
        newRanking = this.createPageRanking()
        const new_targets = [newPage, newText, ...newInfo, newRanking]

        new_targets.forEach((t) => (t.x -= pageShift))

        this.tweens.add({
          targets: new_targets,
          x: `${sign}=${this.game.GW}`,
          duration: 500,
          ease: "Bounce.easeOut",
        })
      },
      onComplete: () => {
        targets.forEach((t) => t.destroy())
        this.actualPage = newPage
        this.actualPageText = newText
        this.actualPageInfo = newInfo
        this.actualRankingIcon = newRanking
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
