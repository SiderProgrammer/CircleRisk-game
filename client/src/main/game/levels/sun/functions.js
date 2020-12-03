export default class {
  constructor(scene) {
    this.scene = scene
  }
  calculateSpawnDistance() {
    this.scene.center_to_circle_distance = Phaser.Math.Distance.BetweenPoints(
      this.scene.manager.circles[1 - this.scene.manager.current_circle],
      {
        x: this.scene.game.GW / 2,
        y: this.scene.game.GH / 2,
      }
    )
  }

  calculateCirclesPosition() {
    this.calculateCircleAngle()
    this.calculateCircleDistance()
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

  rotateTargets() {
    this.scene.manager.target_array.forEach((target, i) => {
      const radians_angle = Phaser.Math.DegToRad(
        this.scene.manager.angle_between * (i - 1) +
          this.scene.targets_rotate_angle
      )

      const targetX =
        this.scene.game.GW / 2 + this.scene.distance * Math.sin(radians_angle)
      const targetY =
        this.scene.game.GH / 2 + this.scene.distance * Math.cos(radians_angle)

      target.setPosition(targetX, targetY)
    })
  }

  createFlyingBirds() {
    const birds = []

    const duration = 10000

    this.scene.anims.create({
      key: "fly",
      frames: this.scene.anims.generateFrameNumbers("bird", {
        start: 0,
        end: 5,
      }),
      repeat: -1,
      frameRate: 8,
    })

    const createBirds = () => {
      birds.forEach((bird) => bird.destroy())
      birds.length = 0

      const option = Phaser.Math.Between(0, 1)

      let y = 0
      option ? (y = this.scene.game.GH / 3 - 100) : (y = -50)

      const tween_y_value = Phaser.Math.Between(30, this.scene.game.GH / 3)

      let tween_string = ""
      option
        ? (tween_string = `-=${tween_y_value}`)
        : (tween_string = `+=${tween_y_value}`)

      if (Phaser.Math.Between(0, 1)) {
        for (let i = 0; i < Phaser.Math.Between(1, 6); i++) {
          birds.push(
            this.scene.add
              .sprite(
                this.scene.game.GW + Phaser.Math.Between(0, 250),
                y + Phaser.Math.Between(0, 180),
                "bird"
              )
              .setAlpha(0.5)
              .play("fly")
          )
        }

        this.scene.tweens.add({
          targets: birds,
          duration: duration,
          x: `-=${this.scene.game.GW * 1.5}`,
          y: tween_string,
          onComplete: () => {
            createBirds()
          },
        })
      } else {
        for (let i = 0; i < Phaser.Math.Between(1, 6); i++) {
          birds.push(
            this.scene.add
              .sprite(
                0 - Phaser.Math.Between(0, 250),
                y + Phaser.Math.Between(0, 180),
                "bird"
              )
              .setAlpha(0.5)
              .setFlipX(true)
              .play("fly")
          )
        }

        this.scene.tweens.add({
          targets: birds,
          duration: duration,
          x: `+=${this.scene.game.GW * 1.5}`,
          y: tween_string,
          onComplete: () => {
            createBirds()
          },
        })
      }
    }

    createBirds()
  }
}
