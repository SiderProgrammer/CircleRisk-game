import Manager from "../../main/level-manager.js"

export default class Instant_Easy extends Phaser.Scene {
  constructor() {
    super("Instant-_Easy")
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
    this.swapTargetToTheNearset()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)
    this.manager.rotation_angle = 180
    this.manager.updateCircleStickAngle()
   
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
  swapTargetToTheNearset(){
    this.manager.next_target  = this.manager.current_target+1;
}
}
