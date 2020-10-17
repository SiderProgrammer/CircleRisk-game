import Manager from "../../main/level-manager.js"
import NightFunctionsManager from "./functions"

export default class Night_Easy extends Phaser.Scene {
  constructor() {
    super("Night_Easy")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()

    this.nightFunctionsManager = new NightFunctionsManager(this);
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()

    this.nightFunctionsManager.darkenTargets()
    
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

  darkenTargets(){
    this.nightFunctionsManager.darkenTargets()
  }

}
