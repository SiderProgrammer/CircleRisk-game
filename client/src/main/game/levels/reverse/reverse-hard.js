import Manager from "../../main/level-manager.js"
import EarthquakeFunctionsManager from "../earthquake/functions"
import ThreeStepFunctionsManager from "../3-step/functions"

export default class Reverse_Hard extends Phaser.Scene {
  constructor() {
    super("Reverse_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.manager.rotation_direction = -1
    this.earthquakeFunctionsManager = new EarthquakeFunctionsManager(this)
    this.threeStepFunctionsManage = new ThreeStepFunctionsManager(this)
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.centerTargets()

    this.manager.target_array.reverse()
    this.swapTargetToTheNearset()
    this.manager.helper.checkNewTargetsQueue()
   
    this.manager.setNewTarget()

    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)
    this.manager.GUI_helper.sceneIntro(this)
    this.arrows = this.add.image(this.game.GW/2,this.game.GH/2,"reverse-arrows")
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
    this.arrows.angle -=0.25;
  }
  shake() {
    this.earthquakeFunctionsManager.shake()
  }

  swapTargetToTheNearset() {
    this.threeStepFunctionsManage.swapTargetToTheNearset()
  }
}
