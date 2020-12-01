import Manager from "../../main/level-manager.js"
import TeleportFunctionsManager from "./functions"
import ChameleonFunctionsManager from "../chameleon/functions"
import CarouselFunctionsManager from "../carousel/functions"

export default class Teleport_Hard extends Phaser.Scene {
  constructor() {
    super("Teleport_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.targets_speed = this.manager.config.targets_speed
    this.fake_targets = []
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
    this.teleportFunctionsManager = new TeleportFunctionsManager(this)
    this.chameleonFunctionsManager = new ChameleonFunctionsManager(this)
    this.carouselFunctionsManager = new CarouselFunctionsManager(this)
    this.carouselFunctionsManager.extractBouncingTargets();
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
    this.carouselFunctionsManager.moveTargetsAndBounceOffWalls()
  }

  teleportCircle() {
    this.teleportFunctionsManager.teleportCircle()
  }
  removeTargetToCatchSkin() {
    this.chameleonFunctionsManager.removeTargetToCatchSkin()
  }
}
