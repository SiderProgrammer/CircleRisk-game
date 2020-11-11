import Manager from "../../main/level-manager.js"
import EarthquakeFunctionsManager from "../earthquake/functions"
import ThreeStepFunctionsManager from "../3-step/functions"

export default class Reverse_Hard extends Phaser.Scene {
  constructor() {
    super("Reverse_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.manager.rotation_direction = -1
    this.earthquakeFunctionsManager = new EarthquakeFunctionsManager(this)
    this.threeStepFunctionsManage = new ThreeStepFunctionsManager(this)
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.centerTargets()

    this.manager.target_array.reverse()
    this.manager.helper.checkNewTargetsQueue()

    this.manager.setNewTarget()

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
  shake() {
    this.earthquakeFunctionsManager.shake()
  }

  swapTargetToTheNearset() {
    this.threeStepFunctionsManage.swapTargetToTheNearset()
  }
}
