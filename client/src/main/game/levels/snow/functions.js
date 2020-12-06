export default class {
  constructor(scene) {
    this.scene = scene
  }
  slideCircle() {
    const radians_angle = this.scene.manager.rotation_angle - 90
    const width =
      this.scene.manager.stick.displayWidth +
      this.scene.manager.circles[this.scene.manager.current_circle].displayWidth

    this.scene.tweens.add({
      targets: this.scene.manager.circles[
        1 - this.scene.manager.current_circle
      ],
      x:
        this.scene.manager.circles[this.scene.manager.current_circle].x +
        width * Math.sin(Phaser.Math.DegToRad(radians_angle + 10)),
      y:
        this.scene.manager.circles[this.scene.manager.current_circle].y -
        width * Math.cos(Phaser.Math.DegToRad(radians_angle + 10)),
      duration: 500,
      onUpdate: () => {
        this.scene.manager.helper.extendStick()
        this.scene.manager.helper.centerStick()
      },
      onComplete: () => {
        //check if missed target
        const distance_from_target = Phaser.Math.Distance.BetweenPoints(
          this.scene.manager.circles[1 - this.scene.manager.current_circle],
          this.scene.manager.target_array[this.scene.manager.current_target]
        )

        if (!this.scene.manager.hasHitTarget(distance_from_target))
          this.scene.manager.gameOver()
      },
    })
  }

  createFallingSnow() {
    const emitter = this.scene.add.particles("particles").createEmitter({
      x: { min: 0, max: this.scene.game.GW },
      y: -50,

      angle: { min: 0, max: 360 },
      scale: { min: 0.5, max: 1 },

      frame: { frames: ["snow"] },
      alpha: 0.5,
      deathZone: {
        type: "onEnter", //-50
        source: new Phaser.Geom.Rectangle(
          0,
          this.scene.game.GH + 50,
          this.scene.game.GW,
          50
        ),
      },
      lifespan: 20000,

      speedY: { min: 100, max: 200 },
      speedX: { min: -20, max: 20 },

      frequency: 600,
      reserve: 20,

      delay: 2500,
    })

    emitter.scaleX.onUpdate = emitter.scaleX.defaultUpdate
  }
}
