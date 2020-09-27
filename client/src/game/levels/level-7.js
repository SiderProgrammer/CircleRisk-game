import Manager from "../main/level-manager.js"
import helper from "../helper.js"
import LevelsFunctionsExtender from "../main/level-functions-extender"

export default class level_7 extends Phaser.Scene {
  constructor() {
    super("level_7")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.levelsFunctionsExtender = new LevelsFunctionsExtender(this)
    this.manager = new Manager(this, config.config)
    this.manager.init()

    this.fly_value = 1
    this.circle_rotate_angle = 0
    this.center_to_circle_distance = 0
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

    helper.sceneIntro(this)
    this.calculateDifferenceDistance() // calculates this.distance
    this.center_to_circle_distance = this.distance

    this.time.addEvent({
      delay: 1500,
      callback: this.changeFlyDirection,
      callbackScope: this,
      loop: true,
    })
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()

    this.moveTargets()
    this.levelsFunctionsExtender.moveCircle()

    this.manager.helper.extendStick()
    this.manager.helper.centerStick()
    this.distance += this.fly_value
    this.center_to_circle_distance += this.fly_value
  }

  moveTargets() {
    this.manager.target_array.forEach((target, i) => {
      const radians_angle = Phaser.Math.DegToRad(
        this.manager.angle_between * (i - 1)
      )

      const targetX = this.game.GW / 2 + this.distance * Math.sin(radians_angle)
      const targetY =
        this.game.GH / 2 +
        this.manager.top_bar.displayHeight / 2 +
        this.distance * Math.cos(radians_angle)

      target.setPosition(targetX, targetY)
    })
  }
  calculateCirclesPosition() {
    this.levelsFunctionsExtender.calculateCircleAngle()
    this.levelsFunctionsExtender.calculateCircleDistance()
  }

  changeFlyDirection() {
    this.fly_value = -this.fly_value
  }

  calculateDifferenceDistance() {
    const pos = this.manager.helper.calculateMinMaxTargetsPos()
    this.distance = (pos.x - pos.minX) / 2
  }
}
