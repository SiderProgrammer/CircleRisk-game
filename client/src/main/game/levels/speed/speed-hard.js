import Manager from "../../main/level-manager.js"
import TinyFunctionsManager from "../tiny/functions"
import NightFunctionsManager from "../night/functions"

export default class Speed_Hard extends Phaser.Scene {
  constructor() {
    super("Speed_Hard")
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

    this.manager.GUI_helper.sceneIntro(this)

    this.tinyFunctionsManager = new TinyFunctionsManager(this)
    this.tinyFunctionsManager.resizeTargets()
    this.nightFunctionsManager = new NightFunctionsManager(this)
    this.nightFunctionsManager.darkenTargets()
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }

  darkenTargets() {
    this.nightFunctionsManager.darkenTargets()
  }
}
