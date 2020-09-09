import Manager from "../main/levelBasic.js"
import helper from "../helper.js"

export default class level_6 extends Phaser.Scene {
  constructor() {
    super("level_6")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this)
    this.manager.init()

    this.rotate_angle = 0
    this.circle_angle = 0
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
    this.manager.createScoreText()

    helper.sceneIntro(this)
    this.calculateDifferenceDistance()

    this.center_to_circle_distance = Phaser.Math.Distance.BetweenPoints(
      this.manager.circles[1 - this.manager.current_circle],
      {
        x: this.game.GW / 2,
        y: this.game.GH / 2 + this.manager.top_bar.displayHeight / 2,
      }
    )
  }
  update() {
    if (!this.manager.game_started) return

    this.rotate_angle += this.manager.config.target_rotate_speed
    this.circle_angle += this.manager.config.target_rotate_speed

    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
    this.rotateTargets()
    this.rotateCircle()

    this.manager.helper.extendStick()
    this.manager.helper.centerStick()
  }

  calculateDifferenceDistance() {
    const pos = this.manager.helper.calculateMinMaxTargetsPos()
    this.distance = (pos.x - pos.minX) / 2
  }

  calculateCirclesPosition() {
    this.calculateCircleAngle()
    this.calculateCircleDistance()
  }
  calculateCircleAngle() {
    const x = this.game.GW / 2
    const y =
      this.game.GH / 2 + this.manager.top_bar.displayHeight / 2 + this.distance

    this.circle_angle =
      -Phaser.Math.RadToDeg(
        Phaser.Math.Angle.BetweenPoints(
          { x: x, y: y },
          this.manager.circles[this.manager.current_circle]
        )
      ) * 2
  }
  calculateCircleDistance() {
    this.center_to_circle_distance = Phaser.Math.Distance.BetweenPoints(
      this.manager.circles[this.manager.current_circle],
      {
        x: this.game.GW / 2,
        y: this.game.GH / 2 + this.manager.top_bar.displayHeight / 2,
      }
    )
  }

  rotateCircle() {
    const radians_angle = Phaser.Math.DegToRad(this.circle_angle)

    const targetX =
      this.game.GW / 2 +
      this.center_to_circle_distance * Math.sin(radians_angle)
    const targetY =
      this.game.GH / 2 +
      this.manager.top_bar.displayHeight / 2 +
      this.center_to_circle_distance * Math.cos(radians_angle)

    this.manager.circles[1 - this.manager.current_circle].setPosition(
      targetX,
      targetY
    )
  }

  rotateTargets() {
    this.manager.target_array.forEach((target, i) => {
      const radians_angle = Phaser.Math.DegToRad(
        this.manager.angle_between * (i - 1) + this.rotate_angle
      )

      const targetX = this.game.GW / 2 + this.distance * Math.sin(radians_angle)
      const targetY =
        this.game.GH / 2 +
        this.manager.top_bar.displayHeight / 2 +
        this.distance * Math.cos(radians_angle)

      target.setPosition(targetX, targetY)
    })
  }
}

/*

    this.manager.target_array.forEach((target, i) => {
      const startX = this.manager.target_array[i].x;
      const startY = this.manager.target_array[i].y;

      const radians_angle = Phaser.Math.DegToRad(
        this.manager.config.additional_angle + this.manager.angle_between * i
      );

      const targetX = startX + 10 * Math.sin(radians_angle);
      const targetY = startY + 10 * Math.cos(radians_angle);

      target.setPosition(targetX, targetY);
*/
