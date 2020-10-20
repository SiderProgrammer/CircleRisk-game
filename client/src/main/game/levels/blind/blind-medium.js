import Manager from "../../main/level-manager.js"
import BlindFunctionsManager from "./functions"
import ChameleonFunctionsManager from "../chameleon/functions"

export default class Blind_Medium extends Phaser.Scene {
  constructor() {
    super("Blind_Medium")
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

    this.chameleonFunctionsManager = new ChameleonFunctionsManager(this)
    this.blindFunctionsManager = new BlindFunctionsManager(this)
    this.blind = this.manager.GUI_helper.createBackground(this, "black")
    this.blindFunctionsManager.blindTheScreen()
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
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
