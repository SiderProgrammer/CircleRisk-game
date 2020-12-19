import * as helper from "../GUI-helper"
import {
  GET_LEVEL_SCORES_AND_NICKNAMES,
  GET_LEVEL_SCORE_BY_NICKNAME,
  GET_TOP_SCORES,
  GET_RANK_FROM_SCORE
} from "../../shortcuts/requests"
import { START_FETCHING_SCENE, STOP_FETCHING_SCENE } from "../../fetch-helper"
import Utils from "../../utils"

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
    this.launcher = data.launcher

    this.GW = this.game.GW
    this.bars = []
    this.texts = []
  }

  async create() {
    helper.createBackground(this, "loading-bg") // can set it to not visbile and show it later
    this.createMyScoretHighLight()
    const upper_strip = this.createUpperStrip()

    this.createHomeButton() // can set it to not visbile and show it later
    this.createLeaderboardButtons() // can set it to not visbile and show it later
    

    START_FETCHING_SCENE(this)


    this.data = await this.getTopScoresData()
    const my_rank = await this.getMyRank()
   
   this.me = this.addAccountText(350);
    this.me.bar = this.addScoreBar(350);

   this.me.update({
     rank:my_rank,
     nickname:my_nickname,
     score:window.progress.levels_scores[this.level-1]
   })

   const icon_y =   upper_strip.displayHeight +
   ((this.me.bar.y - this.me.bar.displayHeight/2)  - upper_strip.displayHeight)/2
   this.previous_page_button.y = icon_y

   this.calculateVariablesHeightDependend() // too long func name
  
    this.createLeaderboardBars()
    this.createLeaderboardTexts()
    this.updateTexts(this.chunkScores())
    this.createOrnaments()

   

    this.createLevelInfo(icon_y)
   


    STOP_FETCHING_SCENE(this)
  }
  chunkScores(){
   
    const copy = [...this.data];
    
    return copy.splice(this.last_start_search_rank-1,this.leaderboard_shift_value)
  }
  
  updateTexts(_sorted_data) {
    const sorted_data = [..._sorted_data]
    this.aura.setVisible(false)

    this.texts.forEach((account_text, i) => {
    
     

      if (!sorted_data[i]) {
        sorted_data[i] = {
          rank: "",
          score: "",
          nickname: "",
        }
      }else {
        sorted_data[i].rank = this.last_start_search_rank +i;
      }

      if (sorted_data[i].nickname === my_nickname) {
        account_text.nickname.setColor(bar_text_config.my_nickname_color)
        this.aura
          .setPosition(account_text.nickname.x, account_text.nickname.y)
          .setVisible(true)
      } else {
        account_text.nickname.setColor(bar_text_config.color)
      }
   
      account_text.update(sorted_data[i])
 
    })
  }

    async getMyRank(){
      try{
        
        return await GET_RANK_FROM_SCORE({
          level:Utils.convertLevelNumberToLevelName(levelsConfiguration[this.level-1]),
          score:window.progress.levels_scores[this.level-1],
        })

      }catch(e){console.log(e);
        STOP_FETCHING_SCENE(this)
      }
    }
  async getTopScoresData() {
   
    try {
     
      return await GET_TOP_SCORES({
        level: Utils.convertLevelNumberToLevelName(levelsConfiguration[this.level-1]),
        players_amount:10,
      })
    } catch {
      STOP_FETCHING_SCENE(this)
    }
  }

  async getUsersAndUpdateTexts(sign) {
   // START_FETCHING_SCENE(this)

    let shift = this.leaderboard_shift_value
 
    if (sign === "-") {
      shift = -shift
    }

 if(this.last_start_search_rank + shift < 1) return

    this.last_start_search_rank += shift
    this.last_stop_search_rank += shift
    
   
    const data = this.chunkScores()
  
    if (data.length > 0) {
      // if exists next leaderboard page
      this.updateTexts(data)
    } else {
      // back to previous page if next not exists
      this.last_start_search_rank -= shift
      this.last_stop_search_rank -= shift
    }
    
   // this.last_start_search_rank += shift
   // await this.searchRanksUpdateLastSearchAndUpdateTexts(shift) // to long function name
   // STOP_FETCHING_SCENE(this)
  }



  createMyScoretHighLight() {
    this.aura = this.add.image(0, 0, "general-1", "lb-aura").setVisible(false)
    helper.setGameSize(this.aura, true)
  }

  createUpperStrip() {
    const strip = this.add
      .image(this.game.GW / 2, 0, "general-1", "lb-strip")
      .setOrigin(0.5, 0)
    helper.setGameSize(strip, true)
    return strip
  }
  createLevelInfo(y) {
    const { difficulty, name } = levelsConfiguration[this.level - 1].info
 
   // this.add.image(this.game.GW / 2, 57, "general-1", "level-select-difficulty-bar")
    this.add
      .text(this.game.GW / 2, 54, difficulty.toUpperCase(), { font: `75px ${main_font}` })
      .setOrigin(0.5)

    this.add.image(this.game.GW / 2, y, "levels-icons", name + "_icon")
  }
  createOrnaments() {
    this.add
      .image(this.game.GW, this.game.GH, "general-1", "lb-eyes")
      .setOrigin(1, 1)
    this.add.image(
      this.game.GW / 2,
      this.game.GH / 2 - 70,
      "general-1",
      "lb-face"
    )
    this.add.image(0, 200, "general-1", "lb-bubbles").setOrigin(0, 0.5)
  }
  calculateVariablesHeightDependend() {
    const bar_height = this.game.textures.list["general-1"].frames[
      "white-strap"
    ].cutHeight

    const shift = 0

    const empty_space =
      this.game.GH -
      this.me.bar.displayHeight -
      this.next_page_button.displayHeight -
      shift - this.me.bar.displayHeight

    const bars_amount = Math.floor(empty_space / bar_height)

    this.first_bar_y =
      (this.me.bar.displayHeight +
        this.next_page_button.displayHeight) /
        2 +
      (empty_space - bar_height * bars_amount) / 2 +
      shift + this.me.bar.displayHeight * 3 // @@ @

    this.last_start_search_rank = 1
    this.last_stop_search_rank = bars_amount
    this.leaderboard_shift_value = bars_amount
  }

  createHomeButton() {
    const x = 50
    const y = 50

    helper
      .createButton(
        this,
        x,
        y,
        "arrow-button-brown",
        () => {
          this.launcher.wake()
          this.scene.stop()
        },
        "button"
      )
      .setAngle(270)
      .setDepth(1)
    
  }

  createLeaderboardButtons() {
    this.previous_page_button = helper
      .createButton(
        this,
        this.GW - 70,
        50,
        "arrow-button-brown",
        () => this.getUsersAndUpdateTexts("-"),
        "button"
      )
      .setDepth(1)



    this.next_page_button = helper
      .createButton(
        this,
        this.GW - 70,
        this.game.GH - 50,
        "arrow-button-brown",
        () => this.getUsersAndUpdateTexts("+"),
        "button"
      )
      .setFlipY(true)
      .setDepth(1)

  

    const me = helper.createButton(
      this,
      this.GW / 2,
      this.game.GH - 50,
      "circle-button-brown",
      () => this.searchMeAndUpdateTexts(),
      "button"
    )
    this.add.image(me.x, me.y, "general-1", "glow")
  }

  createLeaderboardBars() {
    for (let i = 0; i < this.leaderboard_shift_value; i++) {
      const bar = this.addScoreBar(this.first_bar_y).setOrigin(0.5, 0)
      helper.setGameSize(bar, true)
      bar.y += i * bar.displayHeight

     // this.addAccountText(bar.y + bar.displayHeight / 2)
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
      this.texts.push(this.addAccountText(this.bars[i].y + this.bars[i].displayHeight/2))
      
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

 

  

  addAccountText(y) {

return {
  rank : this.add
      .text(40, y, "", {
        ...bar_text_config,
      })
      .setOrigin(0, 0.5),

    nickname : this.add
      .text(this.game.GW / 2, y, "", {
        ...bar_text_config,
      })
      .setOrigin(0.5, 0.5),

    score : this.add
      .text(this.GW - 40, y, "", {
        ...bar_text_config,
      })
      .setOrigin(1, 0.5),


      update:function({rank,nickname,score}){
        this.rank.setText(rank)
        this.nickname.setText(nickname)
        this.score.setText(score)
      }

    }

  }

  addScoreBar(y) {
    return this.add.image(this.GW / 2, y, "general-1", "white-strap")
  }
}
