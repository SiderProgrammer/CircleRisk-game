import Manager from "../../main/level-manager.js"
import OneStepFunctionsManager from "../1-step/functions"
import SunFunctionsManager from "../sun/functions"
import LevelsFunctionsExtender from "../../main/level-functions-extender"
import FlowerFunctionsManager from "./functions"

export default class Flower_Hard extends Phaser.Scene {
  constructor() {
    super("Flower_Hard")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()

     this.levelsFunctionsExtender = new LevelsFunctionsExtender(this)
    this.oneStepFunctionsManager = new OneStepFunctionsManager(this)
        this.targets_rotate_angle = 0
    this.circle_rotate_angle = 0
    this.center_to_circle_distance = 0

    this.flowersFunctionsManager = new FlowerFunctionsManager(this)
     this.sunFunctionsManager = new SunFunctionsManager(this)
  }

  create() {
     this.manager.create()

    this.manager.createGUI()

    this.manager.createFirstTarget()
    this.manager.createTargets()


    this.swapTargetToTheNearset()
    this.manager.helper.checkNewTargetsQueue()


    this.manager.setNewTarget()

    this.manager.centerTargets()

    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)

   
    const pos = this.manager.helper.calculateMinMaxTargetsPos()
    this.distance = (pos.x - pos.minX) / 2

    this.sunFunctionsManager.calculateSpawnDistance()
    this.flowers = [
      this.flowersFunctionsManager.createFlower("flower_1"),
      this.flowersFunctionsManager.createFlower("flower_2"),
      this.flowersFunctionsManager.createFlower("flower_3"),
      this.flowersFunctionsManager.createFlower("flower_1"),
      this.flowersFunctionsManager.createFlower("flower_2"),
      this.flowersFunctionsManager.createFlower("flower_3"),
    ]
    this.flowersFunctionsManager.flowersEffect()
  }
  update() {
    if (!this.manager.game_started) return

        this.targets_rotate_angle += this.manager.config.target_rotate_speed
    this.circle_rotate_angle += this.manager.config.target_rotate_speed

    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()

    this.sunFunctionsManager.rotateTargets()
    this.levelsFunctionsExtender.moveCircle()

    this.manager.helper.extendStick()
    this.manager.helper.centerStick()
  }
  swapTargetToTheNearset() {
    this.oneStepFunctionsManager.swapTargetToTheNearset()
  }
  calculateCirclesPosition() {
    this.sunFunctionsManager.calculateCirclesPosition()
  }
}
