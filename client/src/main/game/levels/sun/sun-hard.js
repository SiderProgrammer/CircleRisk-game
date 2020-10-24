import Manager from "../../main/level-manager.js"

import LevelsFunctionsExtender from "../../main/level-functions-extender"
import SunFunctionsManager from "./functions"
import ExpandFunctionsManager from "../expand/functions"

export default class Sun_Medium extends Phaser.Scene {
  constructor() {
    super("Sun_Medium")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.levelsFunctionsExtender = new LevelsFunctionsExtender(this)

    this.manager = new Manager(this, config.config)
    this.manager.init()

    this.targets_rotate_angle = 0
    this.circle_rotate_angle = 0
    this.center_to_circle_distance = 0

    this.fly_value = 1
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.sunFunctionsManager.createFlyingBirds()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)

    const pos = this.manager.helper.calculateMinMaxTargetsPos()
    this.distance = (pos.x - pos.minX) / 2

    this.center_to_circle_distance = this.distance

    this.sunFunctionsManager = new SunFunctionsManager(this)
    this.expandFunctionsManager = new ExpandFunctionsManager(this)

    this.sunFunctionsManager.calculateSpawnDistance()
  }
  update() {
    if (!this.manager.game_started) return
    this.targets_rotate_angle += this.manager.config.target_rotate_speed
    this.circle_rotate_angle += this.manager.config.target_rotate_speed

    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()

    //  this.expandFunctionsManager.moveTargets()

    this.sunFunctionsManager.rotateTargets()

    this.levelsFunctionsExtender.moveCircle()

    this.manager.helper.extendStick()
    this.manager.helper.centerStick()

    this.expandFunctionsManager.calculateTargetsFlyDirection()
    //this.calculateTargetsFlyDirection()
    this.distance += this.fly_value
    this.center_to_circle_distance += this.fly_value
  }
  calculateCirclesPosition() {
    this.sunFunctionsManager.calculateCirclesPosition()
  }
}
