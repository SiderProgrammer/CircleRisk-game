import Manager from "../../main/level-manager.js"
import BasicFunctionsManager from "./functions"
import {saveProgress,getProgress} from "../../../shortcuts/save"
export default class Basic_Easy extends Phaser.Scene {
  constructor() {
    super("Basic_Easy")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.basicFunctionsManager = new BasicFunctionsManager(this)
    this.is_first_game = getProgress().is_first_game
    this.has_tapped = false;
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.basicFunctionsManager.createFlyingCubes()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)
 
  }
  isInTarget(){
    const distance_from_target = this.manager.helper.calculateRotatingCircleDistanceToTarget()
    if(distance_from_target < 5) return true
        
      
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()

    if(this.is_first_game &&  this.isInTarget() && this.manager.score === 0 ){
      this.is_first_game = false
  
      const rot_speed = this.manager.rotation_speed;
      this.manager.rotation_speed = 0;
      this.manager.createTappingAnimation()
      let has_tapped = false;

      this.input.on("pointerdown",()=>{
        if(has_tapped) return;
        
        const progress = getProgress()
        progress.is_first_game = false;
        saveProgress(progress)

        this.manager.finger.destroy()
        this.manager.rotation_speed = rot_speed;
        has_tapped = true;
      })
    }
 
  }
}
