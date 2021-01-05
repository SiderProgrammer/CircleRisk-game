import Manager from "../../main/level-manager.js"
import SenseFunctionsManager from "./functions"
import TwinsFunctionsManager from "../twins/functions"
import LevelsFunctionsExtender from "../../main/level-functions-extender"
import ExpandFunctionsManager from "../expand/functions"

export default class Sense_Hard extends Phaser.Scene {
  constructor() {
    super("Sense_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.levelsFunctionsExtender = new LevelsFunctionsExtender(this)

    this.fly_value = 1
    this.circle_rotate_angle = 0
    this.center_to_circle_distance = 0 // needed to circle set
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

    this.senseFunctionsManager = new SenseFunctionsManager(this)

    this.twinsFunctionsManager = new TwinsFunctionsManager(this)

    const fake_target_index = this.twinsFunctionsManager.calculateFakeTargetIndex()
    this.twinsFunctionsManager.setFakeTargetToCatch(fake_target_index)
    const pos = this.manager.helper.calculateMinMaxTargetsPos()
    this.distance = (pos.x - pos.minX) / 2

    this.center_to_circle_distance = this.distance

    this.expandFunctionsManager = new ExpandFunctionsManager(this)
    this.expandFunctionsManager.createFlyingPentagons()
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
    this.expandFunctionsManager.moveTargets()
    this.levelsFunctionsExtender.moveCircle()
    this.expandFunctionsManager.calculateTargetsFlyDirection()
    this.manager.helper.extendStick()
    this.manager.helper.centerStick()
    this.distance += this.fly_value
    this.center_to_circle_distance += this.fly_value
  }
  hideSetForAWhile() {
    this.senseFunctionsManager.hideSetForAWhile()
  }
  handleFakeTargetToCatch() {
    this.twinsFunctionsManager.handleFakeTargetToCatch()
  }
  calculateCirclesPosition() {
    this.expandFunctionsManager.calculateCirclesPosition()
  }
}
