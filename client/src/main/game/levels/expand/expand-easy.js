import Manager from "../../main/level-manager.js"

import LevelsFunctionsExtender from "../../main/level-functions-extender"

export default class Expand_Easy extends Phaser.Scene {
  constructor() {
    super("Expand_Easy")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.levelsFunctionsExtender = new LevelsFunctionsExtender(this)
    this.manager = new Manager(this, config.config)
    this.manager.init()

    this.fly_value = 1
    this.circle_rotate_angle = 0
    this.center_to_circle_distance = 0 // needed to circle set
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

    const pos = this.manager.helper.calculateMinMaxTargetsPos()
    this.distance = (pos.x - pos.minX) / 2
    this.max_left_target = this.manager.helper.findTargetIndexByPosition({
      x: pos.minX,
    })

    //  this.calculateDifferenceDistance() // calculates this.distance

    this.stop_point = this.game.GW / 2 - this.distance

    this.center_to_circle_distance = this.distance
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
    this.calculateTargetsFlyDirection()
    this.distance += this.fly_value
    this.center_to_circle_distance += this.fly_value
  }
  calculateTargetsFlyDirection() {
    if (
      this.max_left_target.x - this.max_left_target.displayWidth * 0.5 < 0 ||
      this.max_left_target.x > this.stop_point
    ) {
      // OPTIMISE ( CHECK ONLY TARGET FROM LEFT)
      this.changeFlyDirection()
    }
  }

  moveTargets() {
    this.manager.target_array.forEach((target, i) => {
      const radians_angle = Phaser.Math.DegToRad(
        this.manager.angle_between * (i - 1)
      )

      const targetX = this.game.GW / 2 + this.distance * Math.sin(radians_angle)
      const targetY = this.game.GH / 2 + this.distance * Math.cos(radians_angle)

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
}