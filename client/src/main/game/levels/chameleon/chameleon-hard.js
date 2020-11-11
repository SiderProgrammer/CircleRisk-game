import Manager from "../../main/level-manager.js"
import ChameleonFunctionsManager from "./functions"
import TeleportFunctionsManager from "../teleport/functions"
import CarouselFunctionsManager from "../carousel/functions"

export default class Chameleon_Hard extends Phaser.Scene {
  constructor() {
    super("Chameleon_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.targets_speed = this.manager.config.targets_speed
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

    this.chameleonFunctionsManager = new ChameleonFunctionsManager(this)
    this.teleportFunctionsManager = new TeleportFunctionsManager(this)
    this.carouselFunctionsManager = new CarouselFunctionsManager(this)
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
    this.carouselFunctionsManager.moveTargetsAndBounceOffWalls()
  }
  removeTargetToCatchSkin() {
    this.chameleonFunctionsManager.removeTargetToCatchSkin()
  }

  teleportCircle() {
    this.teleportFunctionsManager.teleportCircle()
  }
}
