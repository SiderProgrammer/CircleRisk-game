import * as helper from "../GUI-helper"
import {
  GET_TOP_SCORES,
  GET_RANK_FROM_SCORE
} from "../../shortcuts/requests"

import { START_FETCHING_SCENE, STOP_FETCHING_SCENE } from "../../fetch-helper"
import Utils from "../../utils"

const bar_text_config = {
  font: `40px LuckiestGuy`,
  color: "#fff",
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
    helper.createBackground(this, "ranking-bg") 
   
    START_FETCHING_SCENE(this)
 
    
    this.data = await this.getTopScoresData()
   // this.data[0].nickname = "@! Admin- :)"
    const my_rank = await this.getMyRank()

const top_three = [...this.data]
top_three.length = 3;


    this.createPodiumSet()

    this.createPodiumNicknames(top_three)

   this.me = this.addAccountText(this.game.GH-70);
    this.me.bar = this.addScoreBar(this.game.GH-70).setTexture("general-3").setFrame("lb-me-bar");

   this.me.update({
     rank:my_rank,
     nickname:my_nickname,
     score:window.progress.levels_scores[this.level-1]
   })

  
this.calculateVariablesHeightDependend() // too long func name
 
 this.gold_line = this.createGoldLine(this.gold_line_y)
this.gold_line.displayWidth -= 180;

this.createHomeButton() 

   this.createScoresBackground()
    this.createLeaderboardBars()
    this.createLeaderboardTexts()
    this.createMedals()
    this.updateTexts(this.chunkScores())
    this.createLeaderboardButtons() 
    
    this.createOrnaments()

    this.createLevelInfo()
   
    STOP_FETCHING_SCENE(this)
  }

  createPodiumSet(){
    const upper_strip = this.createUpperStrip().setVisible(false)
    const aura = this.add.image(this.game.GW/2,upper_strip.y + upper_strip.displayHeight + 170,"podium-aura")
    this.tweens.add({
      targets:aura,
      duration:11000,
      repeat:-1,
      angle:360,
    })


    this.add.image(this.game.GW/2,upper_strip.y + upper_strip.displayHeight + 230,"podium-glow")

    this.podium = this.add.image(this.game.GW/2,upper_strip.y + upper_strip.displayHeight + 150,"podium")
    .setOrigin(0.5,0)
  }
  createPodiumNicknames(players){
    this.add.image(this.game.GW/2,this.podium.y - 105,"general-3","crown-mini")

  if(players[0]) this.createPodiumPlayer(players[0].nickname,this.game.GW/2,this.podium.y - 60).setFontSize("60px")
  if(players[1]) this.createPodiumPlayer(players[1].nickname,this.game.GW/2 - 110,this.podium.y - 5).setOrigin(1,0.5)
  if(players[2]) this.createPodiumPlayer(players[2].nickname,this.game.GW/2 +110 ,this.podium.y + 25).setOrigin(0,0.5)

  }
createPodiumPlayer(player,x,y){
  return this.add
  .text(x, y, player, {
    ...bar_text_config,
  })
  .setOrigin(0.5, 0.5).setDepth(1)
}

createScoresBackground(){
  const bg = this.add.image(this.game.GW/2,this.score_bg_y ,"general-3","lb-scores-bg")
   bg.displayHeight = this.score_bg_height;
   bg.displayWidth = this.game.GW - 15
return bg
}
  createGoldLine(y){
    const line =  this.add.image(this.game.GW/2,y,"general-3","lb-strap")
    helper.setGameSize(line,true);
    line.displayHeight = 20
    line.y = y ;
    return line
  }
  chunkScores(){
   
    const copy = [...this.data];
    
    return copy.splice(this.last_start_search_rank-1,this.leaderboard_shift_value)
  }
  
  updateTexts(_sorted_data) {
    const sorted_data = [..._sorted_data]
    const visible_ranks = []

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

    
    for(let i=1;i<=5;++i){
      if(acc.rank == i){
        visible_ranks.push(i)
      }
    }

 
     if(acc.nickname === my_nickname){
      


       if(acc.rank <=5){
        this.medalManager.fitMedalPositionToMyRank(acc.rank-1)
       }else{
        this.medalManager.resetMedalsPosition()
       }

       acc.rank = "#"+ acc.rank
      
     } 
/*
     if(acc.nickname.indexOf("Admin")){
       // set text red color
       account_text.nickname.setColor("#ff0000")
     }else{
      account_text.nickname.setColor("#ffffff")
     }
*/
      account_text.update(acc)

    })

    for(let i=1;i<=5;++i){
      if(visible_ranks.includes(i)){
        this.medalManager.showMedal(i-1)
      }else{
        this.medalManager.hideMedal(i-1)
      }
    }
  
  }
createMedals(){
  this.medalManager = {
    medals:[]
  }

  const medal_x = this.texts[0].rank.x+50
  const medalPositionFollowedByMyRank = this.texts[0].rank.x+90;

const images = ["1-st","2-nd","3-rd","4-th","5-th"]
for(let i=0;i<5;++i){
  this.medalManager.medals[i] = this.add.image(medal_x,this.texts[i].rank.y+7,"general-3",images[i]);
}
 
  this.medalManager.showMedal = function(i){
    this.medals[i].setVisible(true)
  }
  this.medalManager.hideMedal = function(i){
    this.medals[i].setVisible(false)
  }

  this.medalManager.fitMedalPositionToMyRank = function(i){
    this.medals[i].x  = medalPositionFollowedByMyRank;
    
  }

  this.medalManager.resetMedalsPosition = function(){
  
    this.medals.forEach(medal=>medal.x = medal_x)
  }
}
    async getMyRank(){
      try{
        
        return await GET_RANK_FROM_SCORE({
          level:Utils.convertLevelNumberToLevelName(levelsConfiguration[this.level-1]),
          score:window.progress.levels_scores[this.level-1],
        })

      }catch{
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





  createUpperStrip() {
    const strip = this.add
      .image(this.game.GW / 2, 0, "general-1", "lb-strip")
      .setOrigin(0.5, 0)
    helper.setGameSize(strip, true)
    return strip
  }
  isMysteryLevel(page_number){
    return levelsConfiguration[page_number].info.name.slice(-1) === "-"
  }
  createLevelInfo() {
    const { difficulty, name } = levelsConfiguration[this.level - 1].info
 
    const y = 60
   const bar = this.add.image(this.game.GW/2,y,"general-1","level-select-difficulty-bar")
   bar.displayWidth += 20;

    this.add
      .text(this.game.GW / 2, y, difficulty.toUpperCase(), { font: `65px ${main_font}` })
      .setOrigin(0.5)
   
      let icon = name + "_icon"
    
    if(this.isMysteryLevel(this.level - 1))  icon = "mystery-icon"

    this.add.image(this.game.GW / 2 + bar.displayWidth/2, y, "levels-icons", icon).setDepth(0.1)
    this.add.image(this.game.GW / 2 + bar.displayWidth/2,y,"general-1","glow")
  }
  createOrnaments() {
    helper.setGameSize(
      this.add
        .image(this.game.GW / 2, this.game.GH, "general-2", "levelselect-2")
        .setOrigin(0.5, 1),
      true
    )

helper.setGameSize(
      this.add
        .image(this.game.GW / 2, this.game.GH, "general-2", "levelselect-1")
        .setOrigin(0.5, 1),
      true
    )
  }
  calculateVariablesHeightDependend() {
    const bar_height = this.game.textures.list["general-1"].frames[
      this.lb_texture
    ].cutHeight

    const constant_difference = 55;
    const bottom_space =  bar_height;
    const upper_space = this.podium.y + this.podium.displayHeight + bar_height/2
   const empty_space = this.game.GH - bottom_space - upper_space - constant_difference*2;

    const bars_amount = Math.floor(empty_space/ bar_height)

    const free_space = empty_space - bars_amount *  bar_height;

    this.first_bar_y = upper_space + constant_difference + free_space/2;
   
    this.score_bg_y  = this.first_bar_y + (bars_amount*bar_height)/2  - bar_height/2
    this.score_bg_height = bar_height * bars_amount + 30 

    this.gold_line_y = this.me.bar.y - this.me.bar.displayHeight/2 
    - ((this.me.bar.y - this.me.bar.displayHeight/2) 
    - (this.first_bar_y + this.score_bg_height - bar_height/2))/2 - 10

    this.last_start_search_rank = 1
    this.last_stop_search_rank = bars_amount
    this.leaderboard_shift_value = bars_amount
  }

  createHomeButton() {
    const x = 50
    const y = 60

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
        .setScale(0.76)
  }

  createLeaderboardButtons() {
    this.previous_page_button = helper
      .createButton(
        this,
        this.GW-50,
        this.first_bar_y -  this.me.bar.displayHeight,
        "arrow-button-brown",
        () => this.getUsersAndUpdateTexts("-"),
        "button"
      )
      .setDepth(1).setScale(0.76)


const difference = this.score_bg_y - this.previous_page_button.y

    this.next_page_button = helper
      .createButton(
        this,
        this.GW - 50,
        this.score_bg_y + difference,
        "arrow-button-brown",
        () => this.getUsersAndUpdateTexts("+"),
        "button"
      )
      .setFlipY(true)
      .setDepth(1).setScale(0.76)
      

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
      .setOrigin(0, 0.5).setDepth(1).setFontSize("45px"),

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
    const bar = this.add.image(this.GW / 2 , y, "general-1", this.lb_texture)
    helper.setGameSize(bar, true).displayWidth -=30
    return bar
  }
}
