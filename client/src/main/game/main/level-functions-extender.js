export default class LevelsFunctionsExtender {
  // THIS CLASS IS MENTIONED TO HELP LEVELS WHERE TARGETS ARE MOVING
  constructor(scene) {
    this.scene = scene
  }

  calculateCircleAngle() {
    /// TODO  - optimise the function

    const center_points = {
      x: this.scene.game.GW / 2,
      y: this.scene.game.GH / 2,
    }

    const angle_to_circle_calculated_from_middle = -Phaser.Math.Angle.BetweenPoints(
      center_points,
      this.scene.manager.circles[this.scene.manager.current_circle]
    )

    const angle_to_circle_calculated_from_middle_in_rad =
      angle_to_circle_calculated_from_middle + Phaser.Math.DegToRad(90)

    const points_on_targets_circle = {
      x:
        this.scene.game.GW / 2 +
        this.scene.distance *
          Math.sin(angle_to_circle_calculated_from_middle_in_rad),
      y:
        this.scene.game.GH / 2 +
        this.scene.distance *
          Math.cos(angle_to_circle_calculated_from_middle_in_rad),
    }

    const bottom_center_points = {
      x: this.scene.game.GW / 2,
      y: this.scene.game.GH / 2 + this.scene.distance,
    }

    this.scene.circle_rotate_angle = // angle calculated from bottom center
      -Phaser.Math.RadToDeg(
        Phaser.Math.Angle.BetweenPoints(
          bottom_center_points,
          points_on_targets_circle
        )
      ) * 2
  }

  calculateCircleDistance() {
    this.scene.center_to_circle_distance = Phaser.Math.Distance.BetweenPoints(
      this.scene.manager.circles[this.scene.manager.current_circle], // remove 1 -
      {
        x: this.scene.game.GW / 2,
        y: this.scene.game.GH / 2,
      }
    )
  }

  moveCircle() {
    const radians_angle = Phaser.Math.DegToRad(this.scene.circle_rotate_angle)

    const targetX =
      this.scene.game.GW / 2 +
      this.scene.center_to_circle_distance * Math.sin(radians_angle)
    const targetY =
      this.scene.game.GH / 2 +
      this.scene.center_to_circle_distance * Math.cos(radians_angle)

    this.scene.manager.circles[
      1 - this.scene.manager.current_circle
    ].setPosition(targetX, targetY)
  }
}
