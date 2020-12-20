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
    this.lb_texture = "lb-white-bar"
  }

  async create() {
    helper.createBackground(this, "loading-bg") // can set it to not visbile and show it later
    this.createMyScoretHighLight()
    const upper_strip = this.createUpperStrip().setVisible(false)

    START_FETCHING_SCENE(this)
 
    
    this.data = await this.getTopScoresData()
    const my_rank = await this.getMyRank()
 
    this.createHomeButton() // can set it to not visbile and show it later
    this.createLeaderboardButtons() // can set it to not visbile and show it later

    this.previous_page_button.y = upper_strip.displayHeight + 70
    this.calculateVariablesHeightDependend() // too long func name


   this.me = this.addAccountText(this.me_y);
    this.me.bar = this.addScoreBar(this.me_y).setTexture("lb-me-bar");

   this.me.update({
     rank:my_rank,
     nickname:my_nickname,
     score:window.progress.levels_scores[this.level-1]
   })
   this.add.image(this.game.GW-10,5,"ranking-icon").setOrigin(1,0)
   

   const line =  this.add.image(this.game.GW/2,this.line_y,"lb-strap")
   helper.setGameSize(line,true);
   line.displayHeight = 20
const bg = this.add.image(this.game.GW/2,this.score_bg_y ,"lb-scores-bg")
bg.displayHeight = this.score_bg_height;
bg.displayWidth = this.game.GW - 10

    this.createLeaderboardBars()
    this.createLeaderboardTexts()
    this.updateTexts(this.chunkScores())
    this.createOrnaments()

    this.createLevelInfo(this.previous_page_button.y)
   


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
      
     let acc = sorted_data[i]

      if (!acc) {
        acc = {
          rank: "",
          score: "",
          nickname: "",
        }
      }else {
        acc.rank = this.last_start_search_rank +i;
      }

     
    
      if(acc.rank == "1"){
          account_text.setTextColor("#fff600")
          account_text.rank.setFontSize("62px")
      }
          else if(acc.rank == "2"){
            account_text.setTextColor("#aaa9ad")
            account_text.rank.setFontSize("62px")
          } 
          else if(acc.rank =="3"){
            account_text.setTextColor("#6F0000")
            account_text.rank.setFontSize("62px")
           
          } 
          else if(account_text.rank.style.color != bar_text_config.color){
            account_text.setTextColor(bar_text_config.color)
            account_text.rank.setFontSize("50px")
          } 
            
          
     if(acc.nickname === my_nickname) acc.rank = "#"+ acc.rank
      account_text.update(acc)

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
   this.add.image(this.game.GW/2,54,"general-1","level-select-difficulty-bar")
    this.add
      .text(this.game.GW / 2, 54, difficulty.toUpperCase(), { font: `65px ${main_font}` })
      .setOrigin(0.5)
   
    this.add.image(this.game.GW / 2, y, "levels-icons", name + "_icon").setDepth(0.1)
    this.add.image(this.game.GW/2,y,"general-1","glow")
  }
  createOrnaments() {
    this.add
      .image(this.game.GW, this.game.GH, "general-1", "lb-eyes")
      .setOrigin(1, 1)
 
    this.add.image(0, this.previous_page_button.y, "general-1", "lb-bubbles").setOrigin(0, 0.5)
  }
  calculateVariablesHeightDependend() {
    const bar_height = this.game.textures.list["general-1"].frames[
      this.lb_texture
    ].cutHeight

 const upperAndDownBarsDistanceFromArrows = 15;
   const space_between_myRank_and_leaderboard = bar_height + 20 ;
  const empty_space = this.next_page_button.y - this.previous_page_button.y - this.next_page_button.displayHeight*2  - upperAndDownBarsDistanceFromArrows*2
 
    const bars_amount = Math.floor((empty_space - space_between_myRank_and_leaderboard)/ bar_height)
const distance_from_arrows = (empty_space - (space_between_myRank_and_leaderboard + bars_amount*bar_height))/2 + upperAndDownBarsDistanceFromArrows

    this.me_y = this.previous_page_button.y + this.previous_page_button.displayHeight/2 + bar_height/2 +  distance_from_arrows
    this.first_bar_y = this.me_y + space_between_myRank_and_leaderboard + bar_height/2
  this.line_y = this.me_y + (this.first_bar_y - this.me_y)/2
  this.score_bg_y  = this.first_bar_y + (bars_amount*bar_height)/2  - bar_height/2
  this.score_bg_height = bar_height * bars_amount + 30 
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

  


  }

  createLeaderboardBars() {
    for (let i = 0; i < this.leaderboard_shift_value; i++) {
      const bar = this.addScoreBar(this.first_bar_y)
     
      bar.y += i * bar.displayHeight

     // this.addAccountText(bar.y + bar.displayHeight / 2)
      this.bars.push(bar)
    }

    for (let i = 1; i <= this.bars.length - 1; i += 2) {
      this.bars[i].setVisible(false)
    }
   
  }

  createLeaderboardTexts() {
    for (let i = 0; i < this.bars.length; i++) {
      this.texts.push(this.addAccountText(this.bars[i].y))
      
    }
  }


  addAccountText(y) {

return {
  rank : this.add
      .text(40, y, "", {
        ...bar_text_config,

      })
      .setOrigin(0, 0.5).setDepth(1),

    nickname : this.add
      .text(this.game.GW / 2, y, "", {
        ...bar_text_config,
      })
      .setOrigin(0.5, 0.5).setDepth(1),

    score : this.add
      .text(this.GW - 40, y, "", {
        ...bar_text_config,
      })
      .setOrigin(1, 0.5).setDepth(1),


      update:function({rank,nickname,score}){
        this.rank.setText(rank)
        this.nickname.setText(nickname)
        this.score.setText(score)
      },

      setTextColor:function(color){
        this.rank.setColor(color)
        this.nickname.setColor(color)
        this.score.setColor(color)
   
      }

    }

  }

  addScoreBar(y) {
    const bar = this.add.image(this.GW / 2, y, "general-1", this.lb_texture)
    helper.setGameSize(bar, true).displayWidth -=30
    return bar
  }
}
