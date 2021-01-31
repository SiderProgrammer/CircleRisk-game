import Manager from "../../main/level-manager.js"
import ChameleonFunctionsManager from "./functions"

export default class Chameleon_Easy extends Phaser.Scene {
  constructor() {
    super("Chameleon_Easy")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)

    this.chameleonFunctionsManager = new ChameleonFunctionsManager(this)


   // this.cockroach=  this.add.image(-100,Phaser.Math.Between(0,this.game.GH),"cockroach").setAlpha(0.8)
   // this.moveCockroach()
  }

  moveCockroach(offscreen = false){

    let x = Phaser.Math.Between(150,this.game.GW-100)
    let y= Phaser.Math.Between(150,this.game.GH-100)
    
    if(offscreen){
      Phaser.Math.Between(0,1) ? x = this.game.GW + 100 : x = -100
     Phaser.Math.Between(0,1) ? y = this.game.GH + 100 : y = -100;
    }

    const angle =  Phaser.Math.RadToDeg(
      Phaser.Math.Angle.BetweenPoints({x:this.cockroach.x,y:this.cockroach.y},{x,y}))
        
    this.cockroach.angle += angle*2
    
        this.tweens.add({
          targets:this.cockroach,
          x,
          y,
          duration:600,
          onComplete:()=>{
              this.time.addEvent({
                delay:700,
                callback:()=>{
                //  if(this.cockroach)
                  this.moveCockroach(true)
                }
              })
          }
        })
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
  removeTargetToCatchSkin() {
   this.chameleonFunctionsManager.removeTargetToCatchSkin()
  }
}
