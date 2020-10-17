import Manager from "../../main/level-manager.js"

export default class Sense_Easy extends Phaser.Scene {
  constructor() {
    super("Sense_Easy")
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
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }

  hideSetForAWhile() {
    this.manager.circles.forEach((circle) => circle.setAlpha(0))
    this.manager.stick.setAlpha(0)
    setTimeout(() => this.showSet(), 500)
  }

  showSet() {
    this.manager.circles.forEach((circle) => circle.setAlpha(1))
    this.manager.stick.setAlpha(1)
  }
}
