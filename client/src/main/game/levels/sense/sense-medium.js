import Manager from "../../main/level-manager.js"
import SenseFunctionsManager from "./functions"
import HellFunctionsManager from "../hell/functions"

export default class Sense_Medium extends Phaser.Scene {
  constructor() {
    super("Sense_Medium")
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

    this.senseFunctionsManager = new SenseFunctionsManager(this);
    this.hellFunctionsManager = new HellFunctionsManager(this)
   
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
hideSetForAWhile() {
  this.senseFunctionsManager.hideSetForAWhile()
}
hideTargets() {
    this.hellFunctionsManager.hideTargets()
   }
}
