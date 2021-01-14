import Manager from "../../main/level-manager.js"
import WindFunctionsManager from "./functions"
import {saveProgress,getProgress} from "../../../shortcuts/save"

export default class Wind_Easy extends Phaser.Scene {
  constructor() {
    super("Wind_Easy")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()

    this.targets_speed = {
      x: this.manager.config.targets_speed,
      y: this.manager.config.targets_speed,
    }

    this.windFunctionsManager = new WindFunctionsManager(this)
    this.rated_the_game = getProgress().rated_the_game 
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.windFunctionsManager.createFlyingleafs()

    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)
    this.windFunctionsManager.extractBouncingTargets()
    
  }
  update() {
    if(this.manager.is_new_level_unlocked &&!this.rated_the_game){
      this.rated_the_game = true;
this.time.addEvent({
  delay:100,
  callback:()=>{
    this.scene.pause()
    const progress = getProgress()

    progress.rated_the_game = true;

    saveProgress(progress)

    this.scene.launch("rate",{scene:this})
    this.scene.bringToTop("rate")
  }
})
      
    }

    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()

    this.windFunctionsManager.moveTargetsAndBounceOffWalls()

  
  }
}
