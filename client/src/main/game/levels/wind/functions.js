export default class {
  constructor(scene) {
    this.scene = scene
  }
  moveTargetsAndBounceOffWalls() {
    this.scene.manager.target_array.forEach((target) => {
      if (
        target.x >= this.scene.game.GW - target.displayWidth / 2 ||
        target.x <= 0 + target.displayWidth / 2
      ) {
        this.scene.targets_speed.x = -this.scene.targets_speed.x
      }
      if (
        target.y >= this.scene.game.GH - target.displayHeight / 2 ||
        target.y <= 0 + target.displayHeight / 2 //+ this.scene.manager.top_bar.displayHeight
      ) {
        this.scene.targets_speed.y = -this.scene.targets_speed.y
      }

      this.moveTargetsAndCircles(this.scene.targets_speed)
    })
  }

  moveTargetsAndCircles({ x, y }) {
    this.scene.manager.target_array.forEach((target) => {
      target.x += x
      target.y += y
    })

    const not_rotating_circle = this.scene.manager.circles[
      1 - this.scene.manager.current_circle
    ]

    this.scene.manager.helper.centerStick(this)

    not_rotating_circle.x += x
    not_rotating_circle.y += y
  }
}
