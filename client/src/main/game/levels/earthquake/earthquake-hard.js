import Manager from "../../main/level-manager.js"
import EarthquakeFunctionsManager from "./functions"
import ClockFunctionsManager from "../clock/functions"
import TwinsFunctionsManager from "../twins/functions"
export default class Earthquake_Hard extends Phaser.Scene {
  constructor() {
    super("Earthquake_Hard")
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

    this.twinsFunctionsManager = new TwinsFunctionsManager(this)

    const fake_target_index = this.twinsFunctionsManager.calculateFakeTargetIndex()
    this.twinsFunctionsManager.setFakeTargetToCatch(fake_target_index)
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

  handleFakeTargetToCatch() {
    this.twinsFunctionsManager.handleFakeTargetToCatch()
  }
}
