import Manager from "../../main/level-manager.js"
import UnstableFunctionsManager from "./functions"
import SnowFunctionsManager from "../snow/functions"

export default class Unstable_Hard extends Phaser.Scene {
  constructor() {
    super("Unstable_Hard")
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

    this.unstableFunctionsManager = new UnstableFunctionsManager(this)
    this.snowFunctionsManager = new SnowFunctionsManager(this)
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
  changeRotationSpeed() {
    this.unstableFunctionsManager.changeRotationSpeed()
  }

  slideCircle() {
    this.snowFunctionsManager.slideCircle()
  }
}
