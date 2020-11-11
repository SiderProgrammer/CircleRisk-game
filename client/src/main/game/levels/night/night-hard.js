import Manager from "../../main/level-manager.js"
import NightFunctionsManager from "./functions"
import SunFunctionsManager from "../sun/functions"
import OneStepFunctionsManager from "../1-step/functions"
import LevelsFunctionsExtender from "../../main/level-functions-extender"

export default class Night_Hard extends Phaser.Scene {
  constructor() {
    super("Night_Hard")
  }

  init(config) {
    this.level = config.level

    this.score_to_next_level = config.score_to_next_level

    this.levelsFunctionsExtender = new LevelsFunctionsExtender(this)

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.targets_speed = {
      x: this.manager.config.targets_speed,
      y: this.manager.config.targets_speed,
    }

    this.targets_rotate_angle = 0
    this.circle_rotate_angle = 0
    this.center_to_circle_distance = 0
    this.nightFunctionsManager = new NightFunctionsManager(this)
    this.sunFunctionsManager = new SunFunctionsManager(this)
    this.oneStepFunctionsManager = new OneStepFunctionsManager(this)
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()

    this.nightFunctionsManager.darkenTargets()

    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)

    const pos = this.manager.helper.calculateMinMaxTargetsPos()
    this.distance = (pos.x - pos.minX) / 2

    this.sunFunctionsManager.calculateSpawnDistance()
  }
  update() {
    if (!this.manager.game_started) return

    this.targets_rotate_angle += this.manager.config.target_rotate_speed
    this.circle_rotate_angle += this.manager.config.target_rotate_speed

    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()

    this.sunFunctionsManager.rotateTargets()
    this.levelsFunctionsExtender.moveCircle()

    this.manager.helper.extendStick()
    this.manager.helper.centerStick()
  }
  swapTargetToTheNearset() {
    this.oneStepFunctionsManager.swapTargetToTheNearset()
  }
  darkenTargets() {
    this.nightFunctionsManager.darkenTargets()
  }

  calculateCirclesPosition() {
    this.sunFunctionsManager.calculateCirclesPosition()
  }
}
