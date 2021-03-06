import Manager from "../../main/level-manager.js"
import TinyFunctionsManager from "./functions"
// speed // reverse
export default class Tiny_Hard extends Phaser.Scene {
  constructor() {
    super("Tiny_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
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

    this.tinyFunctionsManager = new TinyFunctionsManager(this)
    this.tinyFunctionsManager.resizeTargets()
    this.tinyFunctionsManager.createVanishingStars()
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
}
