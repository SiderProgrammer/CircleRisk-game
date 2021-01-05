export default class {
  constructor(scene) {
    this.scene = scene
    this.targets_speed = scene.targets_speed
    this.speed_up_value = 0.1
  }
  isBouncingWallX(target) {
    return (
      target.x >= this.scene.game.GW - target.displayWidth / 2 ||
      target.x <= 0 + target.displayWidth / 2
    )
  }

  moveTargetsAndBounceOffWalls() {
    if (this.targets.some((target) => this.isBouncingWallX(target))) {
      this.targets_speed = -this.targets_speed
      this.targets_speed > 0
        ? (this.targets_speed += this.speed_up_value)
        : (this.targets_speed -= this.speed_up_value)
    }

    this.moveTargetsAndCircles(this.targets_speed)
  }

  moveTargetsAndCircles(x) {
    this.scene.manager.target_array.forEach((target) => {
      target.x += x
    })

    const not_rotating_circle = this.scene.manager.circles[
      1 - this.scene.manager.current_circle
    ]

    this.scene.manager.helper.centerStick(this)

    not_rotating_circle.x += x
  }
  extractBouncingTargets() {
    this.targets = []
    const pos = this.scene.manager.helper.calculateMinMaxTargetsPos()

    this.targets.push(
      this.scene.manager.helper.findTargetIndexByPosition({ x: pos.minX })
    )
    this.targets.push(
      this.scene.manager.helper.findTargetIndexByPosition({ x: pos.x })
    )
  }
}
