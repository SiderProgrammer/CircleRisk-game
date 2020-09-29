import * as helper from "../helper"
import { GET_LEVEL_SCORES_AND_NICKNAMES } from "../../shortcuts/requests"
import { START_FETCHING_SCENE, STOP_FETCHING_SCENE } from "../../fetch-helper"

const bar_text_config = {
  font: "30px LuckiestGuy",
}

export default class Leaderboard extends Phaser.Scene {
  constructor() {
    super("leaderboard")
  }
  init(data) {
    this.level = data.level
    this.data = data.ranks

    this.GW = this.game.GW
    this.scores = []
    this.texts = []
    this.first_bar_y = 100
    this.last_start_search_rank = 1
    this.last_stop_search_rank = 8
    this.leaderboard_shift_value = 8
  }

  create() {
    helper.createBackground(this, "black-bg")
    this.createHomeButton()
    this.createLeaderboardButtons()
this.createLeaderboard()
    this.updateTexts(this.data)
  }

  createHomeButton(){
    helper.createButton(this, 50, 50, "home-button", () => {
      this.scene.start("levelSelect", { page: this.level - 1 })
    })
  }

  createLeaderboardButtons(){
    helper.createButton(this, this.GW - 70, 50, "arrow-button", () =>
    this.getUsersAndUpdateTexts("-")
  )

  helper.createButton(
    this,
    this.GW - 70,
    this.game.GH - 50,
    "arrow-button",
    () => this.getUsersAndUpdateTexts("+")
  )
  }

  createLeaderboard(){
    for (let i = 0; i < 8; i++) {
      const bar = this.addScoreBar(this.first_bar_y)

      bar.y += i * bar.displayHeight

      this.addAccountText(bar.y + bar.displayHeight / 2)
      this.scores.push(bar)
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

  getUsersAndUpdateTexts(sign) {
    START_FETCHING_SCENE(this)
    let shift = this.leaderboard_shift_value

    if (sign === "-") {
      shift = -shift
    }
    this.getUsers(
      this.last_start_search_rank + shift,
      this.last_stop_search_rank + shift
    ).then((data) => {
      if (data.length > 0) {
        this.updateTexts(data) // TODO !
      } else {
        this.last_start_search_rank -= shift
        this.last_stop_search_rank -= shift
      }
      STOP_FETCHING_SCENE(this)
    })
  }

  updateTexts(sorted_data) {
    this.texts.forEach((account_text, i) => {
      if (!sorted_data[i]) {
        sorted_data[i] = {
          rank: "",
          score: "",
          nickname: "",
        }
      }

      account_text.rank.setText(sorted_data[i].rank)
      account_text.nickname.setText(sorted_data[i].nickname)
      account_text.score.setText(sorted_data[i].score)
    })
  }

  addAccountText(y) {
    const account_text = {}

    account_text.rank = this.add
      .text(50, y, "", {
        ...bar_text_config,
      })
      .setOrigin(0, 0.5)

    account_text.nickname = this.add
      .text(150, y, "", {
        ...bar_text_config,
      })
      .setOrigin(0, 0.5)

    account_text.score = this.add
      .text(this.GW - 100, y, "", {
        ...bar_text_config,
      })
      .setOrigin(1, 0.5)

    this.texts.push(account_text)
  }

  addScoreBar(y) {
    return this.add.image(this.GW / 2, y, "top-bar").setOrigin(0.5, 0)
  }
}
