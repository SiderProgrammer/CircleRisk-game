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
    this.scene.circle_distance_to_circle = // it is needed to rotate other circle
      Phaser.Math.Distance.BetweenPoints(
        this.scene.circles[1 - this.scene.current_circle],
        this.scene.target_array[this.scene.next_target]
      ) - this.scene.circles[1 - this.scene.current_circle].displayWidth

    this.scene.stick.displayWidth = this.scene.circle_distance_to_circle + 10
  }
  centerStick() {
    const radians_angle = Phaser.Math.DegToRad(this.scene.rotation_angle + 90)
    const width =
      this.scene.circles[1 - this.scene.current_circle].displayWidth / 2 - 5

    this.scene.stick.setPosition(
      this.scene.circles[1 - this.scene.current_circle].x +
        width * Math.sin(radians_angle),
      this.scene.circles[1 - this.scene.current_circle].y -
        width * Math.cos(radians_angle)
    )
  }

  checkNewTargetsQueue() {
    if (this.scene.next_target > this.scene.config.targets_amount - 1) {
      this.scene.next_target -= this.scene.config.targets_amount
    }
  }

  calculateMinMaxTargetsPos() {
    const pos = this.scene.target_array.reduce((acc, tar) => {
      if (acc.texture) {
        // if acc is empty
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

  findTargetIndexByPosition({ x, y }) {
    return this.scene.target_array[
      this.scene.target_array.findIndex((target) => {
        if (x && y) {
          return target.x === x && target.y === y
        } else if (x) return target.x === x
        else return target.y === y
      })
    ]
  }

  normalizeIndexByTargetsAmount(index) {
    // is mutating arguemnt good idea?
    const length = this.scene.target_array.length - 1
    if (index > length) {
      index -= length - 1
    } else if (index < 0) {
      index += length + 1
    }
    return index
  }

  calculateRotatingCircleDistanceToTarget() {
    return Phaser.Math.Distance.BetweenPoints(
      this.scene.circles[this.scene.current_circle],
      this.scene.target_array[this.scene.next_target]
    )
  }
}
