import Manager from "../../main/level-manager.js"
import NightFunctionsManager from "./functions"
import SunFunctionsManager from "../sun/functions"
import LevelsFunctionsExtender from "../../main/level-functions-extender"

export default class Night_Medium extends Phaser.Scene {
  constructor() {
    super("Night_Medium")
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
    this.nightFunctionsManager = new NightFunctionsManager(this)
    this.sunFunctionsManager = new SunFunctionsManager(this)
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
    this.targets_rotate_speed = this.manager.config.target_rotate_speed;
    this.targets_rotate_acceleration = this.manager.config.targets_rotate_acceleration || 0;
 
  }
  update() {
    if (!this.manager.game_started) return

    this.targets_rotate_angle += this.targets_rotate_speed
    this.circle_rotate_angle += this.targets_rotate_speed
    this.targets_rotate_speed +=this.targets_rotate_acceleration;

    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()

    this.sunFunctionsManager.rotateTargets()
    this.levelsFunctionsExtender.moveCircle()

    this.manager.helper.extendStick()
    this.manager.helper.centerStick()
  }

  darkenTargets() {
    this.nightFunctionsManager.darkenTargets()
  }

  calculateCirclesPosition() {
    this.sunFunctionsManager.calculateCirclesPosition()
  }
}
