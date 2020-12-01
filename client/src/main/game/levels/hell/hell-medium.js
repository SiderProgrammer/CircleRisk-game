import Manager from "../../main/level-manager.js"
import HellFunctionsManager from "./functions"
import ThreeStepFunctionsManager from "../3-step/functions"

export default class Hell_Medium extends Phaser.Scene {
  constructor() {
    super("Hell_Medium")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.time_left = this.manager.config.time_left
    this.threeStepFunctionsManage = new ThreeStepFunctionsManager(this)
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

    this.hellFunctionsManager = new HellFunctionsManager(this)
    this.hellFunctionsManager.createBlame()
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }

  hideTargets() {
    this.hellFunctionsManager.hideTargets()
  }

  swapTargetToTheNearset() {
    this.threeStepFunctionsManage.swapTargetToTheNearset()
  }
}
