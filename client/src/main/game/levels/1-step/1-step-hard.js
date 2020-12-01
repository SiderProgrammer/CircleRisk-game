import Manager from "../../main/level-manager.js"
import OneStepFunctionsManager from "./functions"
import HellFunctionsManager from "../hell/functions"
import SnowFunctionsManager from "../snow/functions"

export default class OneStep_Hard extends Phaser.Scene {
  constructor() {
    super("OneStep_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.oneStepFunctionsManager = new OneStepFunctionsManager(this)
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
    this.snowFunctionsManager = new SnowFunctionsManager(this)
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
  hideTargets() {
    this.hellFunctionsManager.hideTargets()
  }
  slideCircle() {
    this.snowFunctionsManager.slideCircle()
  }
}
