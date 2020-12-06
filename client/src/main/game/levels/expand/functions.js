export default class {
  constructor(scene) {
    this.scene = scene
    this.stop_distance = this.calculateDistanceBetweenTargets()
    this.changeFlyDirection()
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

  createFlyingPentagons() {
    const emitter = this.scene.add.particles("pentagon").createEmitter({
      x: this.scene.game.GW,
      y: { min: 0, max: this.scene.game.GH },

      angle: { min: 0, max: 360 },
      scale: { min: 0.8, max: 1.5 },

      alpha: 0.5,
      deathZone: {
        type: "onEnter",
        source: new Phaser.Geom.Rectangle(-50, 0, 50, this.scene.game.GH),
      },
      lifespan: 10000, // { min, max }, or { min, max, steps }

      speedX: { min: -200, max: -300 },

      frequency: 500,
      reserve: 10,
    })

    emitter.scaleX.onUpdate = emitter.scaleX.defaultUpdate
  }
}
