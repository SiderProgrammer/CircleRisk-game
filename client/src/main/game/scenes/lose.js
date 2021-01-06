import { createButton } from "../GUI-helper"
import { getProgress } from "../../shortcuts/save"
import playAudio from "../../shortcuts/audio-player"

export default class Lose extends Phaser.Scene {
  constructor() {
    super("lose")
  }
  init(data) {
    this.progress = window.progress//getProgress()
    this.level_scene = data.scene
    this.are_buttons_active = false
    this.scores_margin_point_x = this.game.GW/2 + 80

  }
  create() {
    this.stats = []
    this.score = this.createScore()
    this.best = this.createBest()
    this.perfect_score = this.createPerfect()
    this.add.image(this.game.GW/2,200,"score-lose-bg").setAlpha(0.5)

    this.emptySpace =
      this.game.GH - (this.purple_strap.y + this.purple_strap.displayHeight / 2)

      this.bottom_buttons_y = this.game.GH - 220
    this.restartAndNextButtonY = this.game.GH - 340
    this.buttons_bg_y = this.restartAndNextButtonY + (this.bottom_buttons_y - this.restartAndNextButtonY)/2 - 15;

    this.createButtons()
  this.buttons_lose_bg = this.add.image(this.game.GW/2,this.buttons_bg_y,"buttons-lose-bg").setAlpha(0.5)
  }
 animateShow(){
   this.are_buttons_active = false;
  return new Promise(async (resolve) => {

this.animateButtonsLoseBg("-")
  this.animateStats("show")
  await this.animateButtons()
    resolve()
 this.are_buttons_active = true;
  })
 
}


animateHide(){
  if(window.admob) admob.banner.hide()
  this.are_buttons_active = false;
return new Promise(async (resolve)=>{
  this.animateButtonsLoseBg("+",200)
  this.animateStats("hide")
  await this.animateButtonsHide()
  resolve()
  this.are_buttons_active = true;
})
}



showStatSet(set,alpha,duration = 400){

  this.tweens.add({
    targets:this.stats[set],
    duration:duration,

    alpha:alpha
  })
}
animateStats(command){
  let alpha = 0
  let duration = 250;
if(command === "hide"){ alpha = 1; duration = 150 }

  for(const stat_set in this.stats){
    this.stats[stat_set].forEach(stat=>stat.setAlpha(alpha))
  }

  alpha = 1;
if(command === "hide") alpha = 0

this.showStatSet("score",alpha,duration)

  this.time.addEvent({
    callback:()=>{
      this.showStatSet("best",alpha,duration)
    },
    delay:50,
  })

  this.time.addEvent({
    callback:()=>{
      this.showStatSet("perfect",alpha,duration)
    },
    delay:110,
  })
}


animateButtonsLoseBg(sign,duration = 350){
  if(sign === "-"){
    this.buttons_lose_bg.x = this.game.GW*1.5
  }else{
    this.buttons_lose_bg.x = this.game.GW/2
  }
  
  this.tweens.add({
    targets:this.buttons_lose_bg ,
    duration:duration,
    x:`${sign}=${this.game.GW}`
  })
}

  activateButtons() {
    this.are_buttons_active = true
  }

  unactivateButtons() {
    this.are_buttons_active = false

  }

  updatePoints(score, perfect, best) {
    this.score.setText(score)
    this.perfect_score.setText(perfect)
    this.best.setText(best)
    this.score.updatePositions()
  }

  

  createScore() {
    this.blue_strap = this.add
      .image(0, 45, "general-1", "blue-strap")
      .setOrigin(0, 0.5).setVisible(false)

    this.blue_strap.y += this.blue_strap.displayHeight / 2

 

  const a =  this.add
      .text(100, this.blue_strap.y + 5, "SCORE", {
        font: "70px LuckiestGuy", /// SCORE TEXT
      })
      .setOrigin(0, 0.5)


      const b = this.add
      .text(
        this.scores_margin_point_x,
        this.blue_strap.y , /// CURRENT SCORE
        0,
        {
          font: "120px LuckiestGuy",
        }
      )
      .setOrigin(0, 0.5)

    const divider = this.add
      .text(b.x + b.displayWidth, this.blue_strap.y + 20, "/", {
        font: "50px LuckiestGuy", /// DIVIDER
      })
      .setOrigin(0,0.5)

   
   const c =  this.add
      .text(
        divider.x + divider.displayWidth ,
        divider.y,
        this.level_scene.score_to_next_level, /// NEEDED SCORE
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0, 0.5)

this.stats.score = [this.blue_strap,a,b,c,divider]

b.updatePositions = () => {
  divider.x = b.x + b.displayWidth
  c.x = divider.x + divider.displayWidth 
}

    return b
  }

 

  createBest() {
    this.red_strap = this.add
      .image(
        0, /// RED STRAP
        this.blue_strap.y + this.blue_strap.displayHeight + 10,
        "general-1",
        "red-strap"
      )
      .setOrigin(0, 0.5).setVisible(false)

   const a = this.add
      .text(100, this.red_strap.y, "BEST", {
        font: "50px LuckiestGuy", /// BEST TEXT
      })
      .setOrigin(0, 0.5)

   const b=  this.add
      .text(
        this.scores_margin_point_x,
        this.red_strap.y,
        this.progress.levels_scores[this.level_scene.level - 1], /// CURRENT BEST SCORE
        {
          font: "90px LuckiestGuy",
        }
      )
      .setOrigin(0,0.5)
      this.stats.best = [this.red_strap,a,b]
      return  b
  }

  createPerfect() {
    this.purple_strap = this.add /// PURPLE STRAP
      .image(
        0,
        this.red_strap.y + this.red_strap.displayHeight + 20,
        "general-1",
        "purple-strap"
      )
      .setOrigin(0, 0.5).setVisible(false)

  const a =   this.add /// PERFECT TEXT
      .text(100, this.purple_strap.y, "PERFECT", {
        font: "50px LuckiestGuy",
      })
      .setOrigin(0, 0.5)

    const b = this.add /// CURRENT PERFECT SCORE
      .text(
        this.scores_margin_point_x,
        this.purple_strap.y,
        0,
        {
          font: "90px LuckiestGuy",
        }
      )
      .setOrigin(0,0.5)
this.stats.perfect = [this.purple_strap,a,b]
    return b
  }

isMysteryLevel(){
  return this.level_scene.scene.key.split("_")[0].slice(-1) === "-"
}

  createButtons() {
    const a = createButton(
      this,
      this.game.GW / 2,
      this.restartAndNextButtonY -
        (this.restartAndNextButtonY - this.purple_strap.y) / 2,
      "ranking-icon",
      () => {
        if (!this.are_buttons_active) return

        if(!window.is_lb_button_clicked){
          window.is_lb_button_clicked = true;
          this.lb_button_tween.remove()
        }
        

        if(window.admob) admob.banner.hide()
        this.scene.sleep()

        this.scene.launch("leaderboard", {
          level: this.level_scene.level,
          launcher: this.scene,
        })

        this.scene.bringToTop("leaderboard")
      },
      "button"
    ).setDepth(0.1)

    const strap = this.add.image(a.x, a.y, "lb-strap")

if(this.isMysteryLevel()){
 a.setVisible(false)
  strap.setVisible(false)
}
 

    if(!window.is_lb_button_clicked){
      this.lb_button_tween =  this.tweens.add({
        targets:a,
        scale:1.15,
        duration:600,
        yoyo:true,
        repeat:-1,
      })
    }
  


    const shift = 200
    const customizeB = createButton(
      this,
      this.game.GW / 2 - shift,
      this.bottom_buttons_y,
      "customize-button",
      async () => {
        if (!this.are_buttons_active) return
        playAudio(this.level_scene,"button")
        await this.animateHide()
        this.level_scene.scene.sleep()
        this.scene.sleep()

        // if are not active and visbile
        this.scene.get("menu").showElementsSharedWithLevelSelect()
        this.scene.get("levelSelect").hideAllElementsInMenuContext()
        //
    
        this.level_scene.scene
          .get("customize")
          .animateCustomizeShow("back", [this.level_scene.scene])
          this.level_scene.scene.wake("menu")
          this.level_scene.scene.wake("customize")
      },
  
    )
customizeB.displayWidth = 155;
customizeB.displayHeight = 155;

  const levelSelectB =  createButton(
      this,
      this.game.GW / 2 + shift,
      this.bottom_buttons_y,
      "levelSelect-button",
     async () => {
        if (!this.are_buttons_active) return
        playAudio(this.level_scene,"button")
        await this.animateHide()

        this.level_scene.scene.stop()
        this.scene.stop()
        
        //this.level_scene.scene.get("menu").hideElementsSharedWithLevelSelect()
        this.level_scene.scene.get("levelSelect").showAllElementsInMenuContext()
        this.level_scene.scene.get("levelSelect").animateLevelSelectShow()

        this.level_scene.scene.wake("menu")
        this.level_scene.scene.wake("levelSelect")
      
      },
  
    )

    this.createRestartButton()
    this.createNextLevelButton()

    this.buttons_differences = {
      difference_1 : (this.game.GH - this.restart_button.y) + this.restart_button.displayHeight/2, 
      difference_2: (this.game.GH - customizeB.y) + customizeB.displayHeight/2,
      difference_3:(this.game.GH - a.y) + a.displayHeight/2,
    }

    this.resetPositionsToHidden = () => {
      a.y = this.restartAndNextButtonY -(this.restartAndNextButtonY - this.purple_strap.y) / 2 + this.buttons_differences.difference_3
      customizeB.y = this.bottom_buttons_y  + this.buttons_differences.difference_2
      levelSelectB.y = this.bottom_buttons_y + this.buttons_differences.difference_2 
      this.next_level_button.y = this.restartAndNextButtonY + this.buttons_differences.difference_1
      this.restart_button.y = this.restartAndNextButtonY + this.buttons_differences.difference_1
      
    }

    this.animateButtons = () => { 
      return new Promise((resolve) =>{

this.resetPositionsToHidden()

strap.displayWidth = 0;

this.tweens.add({
  targets:a,
  duration:300,
  y:`-=${this.buttons_differences.difference_3}`,
  ease:"Power1",
  onComplete:()=>{
    this.tweens.add({
      targets:strap,
      displayWidth:this.game.GW, 
      duration:200,
     // alpha:1
    
    })
  }
})

this.time.addEvent({
  delay:100,
  callback:()=>{
    this.tweens.add({
      targets:[this.restart_button,this.next_level_button],
      y:`-=${this.buttons_differences.difference_1}`,
      duration:300,
      ease:"Power1",
      
    })
  }
})
     

      this.time.addEvent({
        delay: 200,
        callback: () => {
          this.tweens.add({
            targets:[customizeB,levelSelectB],
            y:`-=${this.buttons_differences.difference_2}`,
            duration:300,
            ease:"Power1",
            onComplete:()=>{
              resolve()
            }
          })
        },
      })

     
    })
    }



    this.animateButtonsHide = () => {
      return new Promise((resolve) =>{
        
      this.tweens.add({
        targets:strap,
        displayWidth:0,
        duration:150,
      })
      
      this.tweens.add({
        targets:[customizeB,levelSelectB,this.restart_button,this.next_level_button,a],
        y:`+=${this.game.GH * 0.6}`,
        duration:300,
        ease:"Sine.easeIn",
        onComplete:()=>resolve()
      })
    })
    }
  }

  h(){
    this.hideLBbutton()
  }
  showNextLevelButton() {
    this.next_level_button.setVisible(true).setActive(true)
  }
  showRestartButton() {
    this.restart_button.setVisible(true).setActive(true)
  }

  hideRestartButton() {
    this.restart_button.setVisible(false).setActive(false)
  }
  hideNextLevelButton() {
    this.next_level_button.setVisible(false).setActive(false)
  }
  createNextLevelButton() {
    this.next_level_button = createButton(
      this,
      this.game.GW / 2,
      this.restartAndNextButtonY,
      "next-button",
     async () => {
        if (!this.are_buttons_active) return
        playAudio(this.level_scene,"next_level_sound_1")
        playAudio(this.level_scene,"next_level_sound_2")
        await this.animateHide()
        
        this.scene.stop()


        this.scene.get("levelSelect").updatePageNumberAndColor(this.level_scene.level)
        
        const this_level_configuration =
          levelsConfiguration[this.level_scene.level]

        const { name, difficulty } = this_level_configuration.info

        const level_scene_to_start = `${name.capitalize()}_${difficulty.capitalize()}`

        this.level_scene.scene.start(level_scene_to_start, {
          config: this_level_configuration.config,
          level: this.level_scene.level + 1,
          score_to_next_level:
            this_level_configuration.info.score_to_next_level,
        })
        const started_scene = this.scene.get(level_scene_to_start)
        started_scene.is_first_try = true

        started_scene.scene
          .launch("lose", {
            scene: started_scene,
          })
          .bringToTop("lose")
          .sleep("lose")
      },
     
    )
      .setDepth(11)
      .setActive(false)
      .setVisible(false)
  }

  createRestartButton() {
    this.restart_button = createButton(
      this,
      this.game.GW / 2,
      this.restartAndNextButtonY,
      "replay-button",
     async () => {
        if (!this.are_buttons_active) return
        
        playAudio(this.level_scene,"button")
         await this.animateHide()
         
          this.level_scene.scene.sleep("lose")
          this.level_scene.scene.restart()
        
        //   this.level_scene.game.audio.sounds.restart_sound.play()
       
      },
    
    )
      .setDepth(11)
      .setActive(false)
      .setVisible(false)
  }

  
}
