import Manager from "../../main/level-manager.js"
import ThreeStepFunctionsManager from "./functions"
import ConfusionFunctionsManager from "../confusion/functions"

export default class ThreeStep_Hard extends Phaser.Scene {
  constructor() {
    super("ThreeStep_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.threeStepFunctionsManage = new ThreeStepFunctionsManager(this)
    this.confusionFunctionsManager = new ConfusionFunctionsManager(this)

    this.fake_targets = []
    this.manager.rotation_direction = -1
  }

  create() {
    this.manager.create()

    this.manager.createGUI()

    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.target_array.reverse()
    this.manager.helper.checkNewTargetsQueue()

    this.manager.setNewTarget()

    this.manager.centerTargets()
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

  swapTargetToTheNearset() {
    this.threeStepFunctionsManage.swapTargetToTheNearset()
  }
  handleFakeTargetsToCatch() {
    this.confusionFunctionsManager.handleFakeTargetsToCatch()
  }

  removeCorrectTargetTextureToCatch() {
    this.confusionFunctionsManager.removeCorrectTargetTextureToCatch()
  }
}
