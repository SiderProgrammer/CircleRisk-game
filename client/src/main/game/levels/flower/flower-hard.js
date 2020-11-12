import Manager from "../../main/level-manager.js"
import OneStepFunctionsManager from "../1-step/functions"
import UnstableFunctionsManager from "../unstable/functions"

export default class Flower_Hard extends Phaser.Scene {
  constructor() {
    super("Flower_Hard")
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
    this.oneStepFunctionsManager = new OneStepFunctionsManager(this)
    this.unstableFunctionsManager = new UnstableFunctionsManager(this)
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
  swapTargetToTheNearset() {
    this.oneStepFunctionsManager.swapTargetToTheNearset()
  }
  changeRotationSpeed() {
    this.unstableFunctionsManager.changeRotationSpeed()
  }
}
