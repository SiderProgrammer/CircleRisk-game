import Manager from "../../main/level-manager.js"
import TwinsFunctionsManager from "./functions"
import SenseFunctionsManager from "../sense/functions"
import TeleportFunctionsManager from "../teleport/functions"

export default class Twins_Hard extends Phaser.Scene {
  constructor() {
    super("Twins_Hard")
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

    this.twinsFunctionsManager = new TwinsFunctionsManager(this)
    this.senseFunctionsManager = new SenseFunctionsManager(this)
    this.teleportFunctionsManager = new TeleportFunctionsManager(this)

    const fake_target_index = this.twinsFunctionsManager.calculateFakeTargetIndex()
    this.twinsFunctionsManager.setFakeTargetToCatch(fake_target_index)

    this.manager.GUI_helper.sceneIntro(this)
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
  handleFakeTargetToCatch() {
    this.twinsFunctionsManager.handleFakeTargetToCatch()
  }
  hideSetForAWhile() {
    this.senseFunctionsManager.hideSetForAWhile()
  }

  teleportCircle() {
    this.teleportFunctionsManager.teleportCircle()
  }
}
