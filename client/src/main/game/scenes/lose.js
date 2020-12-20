import { createButton } from "../GUI-helper"
import { getProgress } from "../../shortcuts/save"
export default class Lose extends Phaser.Scene {
  constructor() {
    super("lose")
  }
  init(data) {
    this.progress = window.progress//getProgress()
    this.level_scene = data.scene
    this.are_buttons_active = false
  }
  create() {
    this.stats = []
    this.score = this.createScore()
    this.best = this.createBest()
    this.perfect_score = this.createPerfect()
    this.add.image(this.game.GW/2,200,"score-lose-bg").setAlpha(0.5)

    this.emptySpace =
      this.game.GH - (this.purple_strap.y + this.purple_strap.displayHeight / 2)

      this.bottom_buttons_y = this.game.GH - this.emptySpace / 2 + 130
    this.restartAndNextButtonY = this.game.GH - this.emptySpace / 2 + 10
    this.buttons_bg_y = this.restartAndNextButtonY + (this.bottom_buttons_y - this.restartAndNextButtonY)/2 - 15;

    this.createButtons()
  this.buttons_lose_bg = this.add.image(this.game.GW/2,this.buttons_bg_y,"buttons-lose-bg").setAlpha(0.5)
  }
 animateShow(){
  return new Promise((resolve) => {

this.animateButtonsLoseBg("-")
  this.animateStats("show")
   this.animateButtons()
   .then(()=>resolve())
 
  })
 
}


animateHide(){
return new Promise(resolve=>{
  this.animateButtonsLoseBg("+",200)
  this.animateStats("hide")
  this.animateButtonsHide().then(()=>resolve())
})
}



showStatSet(set,alpha){

  this.tweens.add({
    targets:this.stats[set],
    duration:400,

    alpha:alpha
  })
}
animateStats(command){
  let alpha = 0
if(command === "hide") alpha = 1

  for(const stat_set in this.stats){
    this.stats[stat_set].forEach(stat=>stat.setAlpha(alpha))
  }

  alpha = 1;
if(command === "hide") alpha = 0

this.showStatSet("score",alpha)

  this.time.addEvent({
    callback:()=>{
      this.showStatSet("best",alpha)
    },
    delay:70,
  })

  this.time.addEvent({
    callback:()=>{
      this.showStatSet("perfect",alpha)
    },
    delay:140,
  })
}


animateButtonsLoseBg(sign,duration = 550){
  if(sign === "-"){
    this.buttons_lose_bg.x += this.game.GW
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
  }

  

  createScore() {
    this.blue_strap = this.add
      .image(0, 45, "general-1", "blue-strap")
      .setOrigin(0, 0.5).setVisible(false)

    this.blue_strap.y += this.blue_strap.displayHeight / 2

  const a =  this.add
      .text(100, this.blue_strap.y + 5, "SCORE", {
        font: "60px LuckiestGuy", /// SCORE TEXT
      })
      .setOrigin(0, 0.5)

    const divider = this.add
      .text(this.game.GW - 190, this.blue_strap.y + 20, "/", {
        font: "50px LuckiestGuy", /// DIVIDER
      })
      .setOrigin(0.5)

    const b = this.add
      .text(
        divider.x - divider.displayWidth / 2,
        this.blue_strap.y , /// CURRENT SCORE
        0,
        {
          font: "120px LuckiestGuy",
        }
      )
      .setOrigin(1, 0.5)

   const c =  this.add
      .text(
        divider.x + divider.displayWidth / 2,
        divider.y,
        this.level_scene.score_to_next_level, /// NEEDED SCORE
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0, 0.5)

this.stats.score = [this.blue_strap,a,b,c,divider]


    return b
  }

 

  createBest() {
    this.red_strap = this.add
      .image(
        0, /// RED STRAP
        this.blue_strap.y + this.blue_strap.displayHeight,
        "general-1",
        "red-strap"
      )
      .setOrigin(0, 0.5).setVisible(false)

   const a = this.add
      .text(100, this.red_strap.y, "BEST", {
        font: "45px LuckiestGuy", /// BEST TEXT
      })
      .setOrigin(0, 0.5)

   const b=  this.add
      .text(
        this.score.x - this.score.displayWidth / 2,
        this.red_strap.y,
        this.progress.levels_scores[this.level_scene.level - 1], /// CURRENT BEST SCORE
        {
          font: "90px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
      this.stats.best = [this.red_strap,a,b]
      return  b
  }

  createPerfect() {
    this.purple_strap = this.add /// PURPLE STRAP
      .image(
        0,
        this.red_strap.y + this.red_strap.displayHeight + 10,
        "general-1",
        "purple-strap"
      )
      .setOrigin(0, 0.5).setVisible(false)

  const a =   this.add /// PERFECT TEXT
      .text(100, this.purple_strap.y, "PERFECT", {
        font: "45px LuckiestGuy",
      })
      .setOrigin(0, 0.5)

    const b = this.add /// CURRENT PERFECT SCORE
      .text(
        this.score.x - this.score.displayWidth / 2,
        this.purple_strap.y,
        0,
        {
          font: "90px LuckiestGuy",
        }
      )
      .setOrigin(0.5)
this.stats.perfect = [this.purple_strap,a,b]
    return b
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

    const shift = 200
    const customizeB = createButton(
      this,
      this.game.GW / 2 - shift,
      this.bottom_buttons_y,
      "customize-button",
      () => {
        if (!this.are_buttons_active) return
        this.level_scene.scene.sleep()
        this.scene.sleep()

        this.level_scene.scene.wake("menu")
        this.scene.get("menu").showElementsSharedWithLevelSelect()
        this.scene.get("levelSelect").hideAllElementsInMenuContext()
        this.level_scene.scene.wake("customize")
        this.level_scene.scene
          .get("customize")
          .animateCustomizeShow("back", [this.level_scene.scene])
      },
      "button"
    )
customizeB.displayWidth = 155;
customizeB.displayHeight = 155;

  const levelSelectB =  createButton(
      this,
      this.game.GW / 2 + shift,
      this.bottom_buttons_y,
      "levelSelect-button",
      () => {
        if (!this.are_buttons_active) return
        this.level_scene.scene.stop()
        this.scene.stop()

        this.level_scene.scene.wake("menu")
        this.level_scene.scene.wake("levelSelect")
        this.level_scene.scene.get("levelSelect").animateLevelSelectShow()
      },
      "button" //sceneTransition(this.level_scene, "levelSelect")
    )

    this.createRestartButton()
    this.createNextLevelButton()

    this.animateButtons = () => { 
      return new Promise((resolve) =>{

     
   
      const difference_1 = (this.game.GH - this.restart_button.y) + this.restart_button.displayHeight/2
this.restart_button.y += difference_1
this.next_level_button.y += difference_1

const difference_2 = (this.game.GH - customizeB.y) + customizeB.displayHeight/2
customizeB.y += difference_2
levelSelectB.y += difference_2

const difference_3 = (this.game.GH - a.y) + a.displayHeight/2
a.y+=difference_3;

strap.displayWidth = 0;
//strap.setAlpha(0)



this.tweens.add({
  targets:a,
  duration:500,
  y:`-=${difference_3}`,
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
      y:`-=${difference_1}`,
      duration:500,
      ease:"Power1",
      
    })
  }
})
     

      this.time.addEvent({
        delay: 400,
        callback: () => {
          this.tweens.add({
            targets:[customizeB,levelSelectB],
            y:`-=${difference_2}`,
            duration:500,
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
        duration:200,
      })
      
      this.tweens.add({
        targets:[customizeB,levelSelectB,this.restart_button,this.next_level_button,a],
        y:`+=${this.game.GH/2}`,
        duration:400,
        ease:"Sine.easeIn",
        onComplete:()=>resolve()
      })
    })
    }
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
      () => {
        if (!this.are_buttons_active) return
        this.scene.stop()

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
      "button"
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
        await this.animateHide()
        //   this.level_scene.game.audio.sounds.restart_sound.play()
        this.level_scene.scene.sleep("lose")
        this.level_scene.scene.restart()
      },
      "button"
    )
      .setDepth(11)
      .setActive(false)
      .setVisible(false)
  }

  
}
