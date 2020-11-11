import Manager from "../../main/level-manager.js"
import ClockFunctionsManager from "./functions"
import ChameleonFunctionsManager from "../chameleon/functions"
import SenseFunctionsManager from "../sense/functions"

export default class Clock_Hard extends Phaser.Scene {
  constructor() {
    super("Clock_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()

    this.time_left = this.manager.config.time_left
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

    this.chameleonFunctionsManager = new ChameleonFunctionsManager(this)
    this.clockFunctionsManager = new ClockFunctionsManager(this)
    this.clockFunctionsManager.createTimerText()
    this.clockFunctionsManager.setTimer()

    this.manager.GUI_helper.sceneIntro(this)
    this.senseFunctionsManager = new SenseFunctionsManager(this)
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
  removeTargetToCatchSkin() {
    this.chameleonFunctionsManager.removeTargetToCatchSkin()
  }
}
