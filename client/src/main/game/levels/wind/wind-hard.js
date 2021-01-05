import Manager from "../../main/level-manager.js"
import WindFunctionsManager from "./functions"
import PulsateFunctionsManager from "../pulsate/functions"
import ConfusionFunctionsManager from "../confusion/functions"

export default class Wind_Hard extends Phaser.Scene {
  constructor() {
    super("Wind_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()

    this.targets_speed = {
      x: this.manager.config.targets_speed,
      y: this.manager.config.targets_speed,
    }
    this.pulsateFunctionsManager = new PulsateFunctionsManager(this)
    this.windFunctionsManager = new WindFunctionsManager(this)
    this.confusionFunctionsManager = new ConfusionFunctionsManager(this)

    this.fake_targets = []
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.windFunctionsManager.createFlyingleafs()

    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)
    this.pulsateFunctionsManager.makeTargetsPulse()
    this.windFunctionsManager.extractBouncingTargets()
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()

    this.windFunctionsManager.moveTargetsAndBounceOffWalls()
  }
  handleFakeTargetsToCatch() {
    this.confusionFunctionsManager.handleFakeTargetsToCatch()
  }

  removeCorrectTargetTextureToCatch() {
    this.confusionFunctionsManager.removeCorrectTargetTextureToCatch()
  }
}
