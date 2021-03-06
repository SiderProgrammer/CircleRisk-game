import Manager from "../../main/level-manager.js"
import SnowFunctionsManager from "./functions"
import UnstableFunctionsManager from "../unstable/functions"

export default class Snow_Medium extends Phaser.Scene {
  constructor() {
    super("Snow_Medium")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.snowFunctionsManager = new SnowFunctionsManager(this)
    this.unstableFunctionsManager = new UnstableFunctionsManager(this)
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.snowFunctionsManager.createFallingSnow()
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
  slideCircle() {
    this.snowFunctionsManager.slideCircle()
  }
  changeRotationSpeed() {
    this.unstableFunctionsManager.changeRotationSpeed()
  }
}
