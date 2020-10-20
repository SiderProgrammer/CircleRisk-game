import Manager from "../../main/level-manager.js"
import EarthquakeFunctionsManager from "./functions"
import ClockFunctionsManager from "../clock/functions"

export default class Earthquake_Medium extends Phaser.Scene {
  constructor() {
    super("Earthquake_Medium")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.earthquakeFunctionsManager = new EarthquakeFunctionsManager(this)
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

    this.clockFunctionsManager = new ClockFunctionsManager(this)
    this.clockFunctionsManager.createTimerText()

    this.manager.GUI_helper.sceneIntro(this)
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
  shake() {
    this.earthquakeFunctionsManager.shake()
  }

  setTimer() {
    this.clockFunctionsManager.setTimer()
  }
}
