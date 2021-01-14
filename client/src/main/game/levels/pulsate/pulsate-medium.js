import Manager from "../../main/level-manager.js"
import PulsateFunctionsManager from "./functions"
import SenseFunctionsManager from "../sense/functions"

export default class Pulsate_Medium extends Phaser.Scene {
  constructor() {
    super("Pulsate_Medium")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.pulsateFunctionsManager = new PulsateFunctionsManager(this)
    this.senseFunctionsManager = new SenseFunctionsManager(this)
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.pulsateFunctionsManager.createComets()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    //this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)

    this.pulsateFunctionsManager.makeTargetsPulse()
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
  hideSetForAWhile() {
    this.senseFunctionsManager.hideSetForAWhile()
  }
}
