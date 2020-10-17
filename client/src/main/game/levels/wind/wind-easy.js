import Manager from "../../main/level-manager.js"
import WindFunctionsManager from "./functions"

export default class Wind_Easy extends Phaser.Scene {
  constructor() {
    super("Wind_Easy")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()

    this.targets_speed = {
      x: this.manager.config.targets_speed,
      y: this.manager.config.targets_speed,
    }

    this.windFunctionsManager = new WindFunctionsManager(this)
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
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()

    this.windFunctionsManager.moveTargetsAndBounceOffWalls()
  }
}
