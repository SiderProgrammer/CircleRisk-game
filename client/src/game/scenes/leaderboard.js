import * as helper from "../helper"
import {
  GET_LEVEL_SCORES_AND_NICKNAMES,
  GET_LEVEL_SCORE_BY_NICKNAME,
} from "../../shortcuts/requests"
import { START_FETCHING_SCENE, STOP_FETCHING_SCENE } from "../../fetch-helper"

const bar_text_config = {
  font: `50px LuckiestGuy`,
  color: "#fff",
  my_nickname_color: "0xff00ff",
}

export default class Leaderboard extends Phaser.Scene {
  constructor() {
    super("leaderboard")
  }
  init(data) {
    this.level = data.level

    this.GW = this.game.GW
    this.bars = []
    this.texts = []
  }

  async create() {
    helper.createBackground(this, "leaderboard-bg") // can set it to not visbile and show it later
    this.createMyScoretHighLight()
    this.createUpperStrip()

    this.createHomeButton() // can set it to not visbile and show it later
    this.createLeaderboardButtons() // can set it to not visbile and show it later
    this.calculateVariablesHeightDependend() // too long func name

    START_FETCHING_SCENE(this)

    const data = await this.getUsers(
      this.last_start_search_rank,
      this.last_stop_search_rank
    )

    this.createLeaderboardBars()
    this.createLeaderboardTexts()
    this.updateTexts(data)
    this.createOrnaments()
    this.createLevelInfo()

    STOP_FETCHING_SCENE(this)
  }
  createMyScoretHighLight() {
    this.aura = this.add.image(0, 0, "lb-aura").setVisible(false)
    helper.setGameSize(this.aura, true)
  }

  createUpperStrip() {
    const strip = this.add
      .image(this.game.GW / 2, 0, "lb-strip")
      .setOrigin(0.5, 0)
    helper.setGameSize(strip, true)
  }
  createLevelInfo() {
    const { difficulty, name } = levelsConfiguration[this.level - 1].info

    this.add
      .text(this.game.GW / 2, 80, difficulty, { font: `50px ${main_font}` })
      .setOrigin(0.5)
    this.add.image(this.game.GW / 2, 200, name + "_icon")
  }
  createOrnaments() {
    this.add.image(this.game.GW, this.game.GH, "lb-eyes").setOrigin(1, 1)
    this.add.image(this.game.GW / 2 - 20, this.game.GH / 2, "lb-face")
    this.add.image(0, 200, "lb-bubbles").setOrigin(0, 0.5)
  }
  calculateVariablesHeightDependend() {
    const bar_height = this.game.textures.list["white-strap"].frames.__BASE
      .cutHeight

    const shift = 160

    const empty_space =
      this.game.GH -
      this.previous_page_button.displayHeight -
      this.next_page_button.displayHeight -
      shift

    const bars_amount = Math.floor(empty_space / bar_height)

    this.first_bar_y =
      (this.previous_page_button.displayHeight +
        this.next_page_button.displayHeight) /
        2 +
      (empty_space - bar_height * bars_amount) / 2 +
      shift

    this.last_start_search_rank = 1
    this.last_stop_search_rank = bars_amount
    this.leaderboard_shift_value = bars_amount
  }

  createHomeButton() {
    const x = 50
    const y = 50

    helper
      .createButton(this, x, y, "arrow-button-brown", () => {
        this.scene.start("levelSelect", { page: this.level - 1 })
      })
      .setAngle(270)
      .setDepth(1)
    this.add.image(x + 10, y, "glow")
  }

  createLeaderboardButtons() {
    this.previous_page_button = helper
      .createButton(this, this.GW - 70, 50, "arrow-button-brown", () =>
        this.getUsersAndUpdateTexts("-")
      )
      .setDepth(1)

    this.add.image(
      this.previous_page_button.x,
      this.previous_page_button.y + 10,
      "glow"
    )

    this.next_page_button = helper
      .createButton(
        this,
        this.GW - 70,
        this.game.GH - 50,
        "arrow-button-brown",
        () => this.getUsersAndUpdateTexts("+")
      )
      .setFlipY(true)
      .setDepth(1)

    this.add.image(
      this.next_page_button.x,
      this.next_page_button.y - 10,
      "glow"
    )

    const me = helper.createButton(
      this,
      this.GW / 2,
      this.game.GH - 50,
      "circle-button-brown",
      () => this.searchMeAndUpdateTexts()
    )
    this.add.image(me.x, me.y, "glow")
  }

  createLeaderboardBars() {
    for (let i = 0; i < this.leaderboard_shift_value; i++) {
      const bar = this.addScoreBar(this.first_bar_y).setOrigin(0.5, 0)
      helper.setGameSize(bar, true)
      bar.y += i * bar.displayHeight

      this.addAccountText(bar.y + bar.displayHeight / 2)
      this.bars.push(bar)
    }

    for (let i = 1; i <= this.bars.length - 1; i += 2) {
      this.bars[i].setVisible(false)
    }
    /*
    const makeScoreBar = () => {
      const bar = this.addScoreBar(this.game.GH / 2)
      helper.setGameSize(bar, true)
      this.bars.push(bar)
      return bar
    }

    makeScoreBar()

    for (let i = 1; i <= 3; i++) {
      for (let j = -1; j <= 1; j += 2) {
        const bar = makeScoreBar()
        bar.y += i * bar.displayHeight * j
      }
    }

    this.bars.sort((a, b) => a.y - b.y)
    */
  }

  createLeaderboardTexts() {
    for (let i = 0; i < this.bars.length - 1; i++) {
      this.addAccountText(this.bars[i].y)
    }
  }

  async searchMeAndUpdateTexts() {
    START_FETCHING_SCENE(this)

    try {
      const { rank } = await GET_LEVEL_SCORE_BY_NICKNAME({
        level: this.level,
        nickname: my_nickname,
      })

      let position_in_leaderboard = rank % this.leaderboard_shift_value

      if (position_in_leaderboard === 0) {
        // if mod === 0 the nickname should be placed in position which is mod value
        position_in_leaderboard = this.leaderboard_shift_value
      }
      this.last_start_search_rank = rank - position_in_leaderboard + 1
      this.last_stop_search_rank =
        rank + this.leaderboard_shift_value - position_in_leaderboard

      await this.searchRanksUpdateLastSearchAndUpdateTexts(0)
    } catch {
    } finally {
      STOP_FETCHING_SCENE(this)
    }
  }

  async getUsers(start, stop) {
    this.last_start_search_rank = start
    this.last_stop_search_rank = stop

    return await GET_LEVEL_SCORES_AND_NICKNAMES({
      level: this.level,
      start_search_rank: start,
      stop_search_rank: stop,
    })
  }

  async getUsersAndUpdateTexts(sign) {
    START_FETCHING_SCENE(this)
    let shift = this.leaderboard_shift_value

    if (sign === "-") {
      shift = -shift
    }
    await this.searchRanksUpdateLastSearchAndUpdateTexts(shift) // to long function name
    STOP_FETCHING_SCENE(this)
  }

  async searchRanksUpdateLastSearchAndUpdateTexts(shift) {
    const data = await this.getUsers(
      this.last_start_search_rank + shift,
      this.last_stop_search_rank + shift
    )

    if (data.length > 0) {
      // if exists next leaderboard page
      this.updateTexts(data) // TODO !
    } else {
      // back to previous page if next not exists
      this.last_start_search_rank -= shift
      this.last_stop_search_rank -= shift
    }
  }

  updateTexts(sorted_data) {
    this.aura.setVisible(false)

    this.texts.forEach((account_text, i) => {
      if (!sorted_data[i]) {
        sorted_data[i] = {
          rank: "",
          score: "",
          nickname: "",
        }
      }

      if (sorted_data[i].nickname === my_nickname) {
        account_text.nickname.setColor(bar_text_config.my_nickname_color)
        this.aura
          .setPosition(account_text.nickname.x, account_text.nickname.y)
          .setVisible(true)
      } else {
        account_text.nickname.setColor(bar_text_config.color)
      }

      account_text.rank.setText(sorted_data[i].rank)
      account_text.nickname.setText(sorted_data[i].nickname)
      account_text.score.setText(sorted_data[i].score)
    })
  }

  addAccountText(y) {
    const account_text = {}

    account_text.rank = this.add
      .text(40, y, "", {
        ...bar_text_config,
      })
      .setOrigin(0, 0.5)

    account_text.nickname = this.add
      .text(this.game.GW / 2, y, "", {
        ...bar_text_config,
      })
      .setOrigin(0.5, 0.5)

    account_text.score = this.add
      .text(this.GW - 40, y, "", {
        ...bar_text_config,
      })
      .setOrigin(1, 0.5)

    this.texts.push(account_text)
  }

  addScoreBar(y) {
    return this.add.image(this.GW / 2, y, "white-strap")
  }
}
