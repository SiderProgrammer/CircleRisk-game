export default class {
  constructor(scene) {
    this.scene = scene
    this.stop_distance = this.calculateDistanceBetweenTargets()
  }

  calculateDistanceBetweenTargets() {
    return Phaser.Math.Distance.BetweenPoints(
      this.scene.manager.target_array[0],
      this.scene.manager.target_array[1]
    )
  }
  calculateTargetsFlyDirection() {
    if (
      !this.changed_direction &&
      (this.calculateDistanceBetweenTargets() < this.stop_distance ||
        this.anyTouchBounds())
    ) {
      this.changed_direction = true
      this.changeFlyDirection()
    } else {
      this.changed_direction = false
    }
  }

  anyTouchBounds() {
    return this.scene.manager.target_array.some(
      (t) => t.x - t.displayWidth / 2 < 0
    )
  }

  moveTargets() {
    this.scene.manager.target_array.forEach((target, i) => {
      const radians_angle = Phaser.Math.DegToRad(
        this.scene.manager.angle_between * (i - 1)
      )

      const targetX =
        this.scene.game.GW / 2 + this.scene.distance * Math.sin(radians_angle)
      const targetY =
        this.scene.game.GH / 2 + this.scene.distance * Math.cos(radians_angle)

      target.setPosition(targetX, targetY)
    })
  }
  calculateCirclesPosition() {
    this.scene.levelsFunctionsExtender.calculateCircleAngle()
    this.scene.levelsFunctionsExtender.calculateCircleDistance()
  }

  changeFlyDirection() {
    this.scene.fly_value = -this.scene.fly_value
  }
}
