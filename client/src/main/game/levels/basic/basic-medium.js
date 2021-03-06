import Manager from "../../main/level-manager.js"
import BasicFunctionsManager from "./functions"

export default class Basic_Medium extends Phaser.Scene {
  constructor() {
    super("Basic_Medium")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.basicFunctionsManager = new BasicFunctionsManager(this)
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.basicFunctionsManager.createFlyingCubes()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
}
