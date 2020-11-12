import Manager from "../../main/level-manager.js"
import PulsateFunctionsManager from "./functions"
import NightFunctionsManager from "../night/functions"
import BlindFunctionsManager from "../blind/functions"

export default class Pulsate_Hard extends Phaser.Scene {
  constructor() {
    super("Pulsate_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.pulsateFunctionsManager = new PulsateFunctionsManager(this)
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    //this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)

    this.pulsateFunctionsManager.makeTargetsPulse()
    this.nightFunctionsManager = new NightFunctionsManager(this)
    this.blindFunctionsManager = new BlindFunctionsManager(this)
    this.blind = this.manager.GUI_helper.createBackground(this, "black")
    this.blind.setDepth(1).setVisible(false)
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
  blindTheScreen() {
    this.blindFunctionsManager.blindTheScreen()
  }
}
