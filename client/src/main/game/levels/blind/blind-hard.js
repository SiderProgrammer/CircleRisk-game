import Manager from "../../main/level-manager.js"
import BlindFunctionsManager from "./functions"
import ChameleonFunctionsManager from "../chameleon/functions"
import WindFunctionsManager from "../wind/functions"

export default class Blind_Hard extends Phaser.Scene {
  constructor() {
    super("Blind_Hard")
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
    this.blindFunctionsManager = new BlindFunctionsManager(this)

    this.blind = this.manager.GUI_helper.createBackground(this, "black")
    this.blind.setDepth(1).setVisible(false)

    this.windFunctionsManager = new WindFunctionsManager(this)
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
    this.windFunctionsManager.moveTargetsAndBounceOffWalls()
  }

  blindTheScreen() {
    this.blindFunctionsManager.blindTheScreen()
  }
  removeTargetToCatchSkin() {
    this.chameleonFunctionsManager.removeTargetToCatchSkin()
  }

  removeTargetToCatchSkin() {
    this.chameleonFunctionsManager.removeTargetToCatchSkin()
  }
}
