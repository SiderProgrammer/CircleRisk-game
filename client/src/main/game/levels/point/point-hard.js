import Manager from "../../main/level-manager.js"
import PointFunctionsManager from "./functions"
export default class Point_Hard extends Phaser.Scene {
  constructor() {
    super("Point-_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level
    this.not_count_stats = true;
    this.manager = new Manager(this, config.config)
    this.manager.init()
this.pointFunctionsManager = new PointFunctionsManager(this)
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
  
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.swapTargetToTheNearset()
    this.manager.setNewTarget()
this.swapTargetToTheNearset()
    this.manager.target_array[0].setPosition(this.game.GW/2,this.game.GH/2)
    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)
   
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
   swapTargetToTheNearset(){
       this.pointFunctionsManager.swapTargetToTheNearset()
   }
}
