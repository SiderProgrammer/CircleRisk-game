export default class LevelHelper {
  constructor(scene) {
    this.scene = scene
  }
  randomNextTarget() {
    this.scene.next_target = Phaser.Math.Between(
      this.scene.current_target + 1,
      this.scene.current_target + 3
    )
  }
  extendStick() {
    this.scene.stick.displayWidth =
      Phaser.Math.Distance.BetweenPoints(
        this.scene.circles[1 - this.scene.current_circle],
        this.scene.target_array[this.scene.next_target]
      ) - this.scene.circles[1 - this.scene.current_circle].displayWidth
  }
  centerStick() {
    const radians_angle = Phaser.Math.DegToRad(this.scene.rotation_angle + 90)
    const width =
      this.scene.circles[1 - this.scene.current_circle].displayWidth / 2

    this.scene.stick.setPosition(
      this.scene.circles[1 - this.scene.current_circle].x +
        width * Math.sin(radians_angle),
      this.scene.circles[1 - this.scene.current_circle].y -
        width * Math.cos(radians_angle)
    )
  }

  checkNewTargetsQueue() {
    if (this.scene.next_target > this.scene.config.targets_amount - 1) {
      this.scene.next_target = Phaser.Math.Between(
        1,
        this.scene.next_target - this.scene.config.targets_amount - 1
      )
    }
  }

  calculateMinMaxTargetsPos() {
    const pos = this.scene.target_array.reduce((acc, tar) => {
      if (acc.texture) {
        acc = {
          x: tar.x,
          y: tar.y,
          minY: tar.y,
          minX: tar.x,
        }
      } else {
        if (acc.x < tar.x) {
          acc.x = tar.x
        }
        if (acc.y < tar.y) {
          acc.y = tar.y
        }
        if (acc.minY > tar.y) {
          acc.minY = tar.y
        }
        if (acc.minX > tar.x) {
          acc.minX = tar.x
        }
      }
      return acc
    })

    return pos
  }
}
