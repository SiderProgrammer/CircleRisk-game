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
    if (
      this.scene.manager.target_array.some((target) =>
        this.isBouncingWallX(target)
      )
    ) {
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
  createFlyingleafs() {
    this.scene.add.particles("particles").createEmitter({
      x: this.scene.game.GW + 50,
      y: { min: 0, max: 100 },

      angle: { min: 0, max: 360 },
      scale: { min: 0.6, max: 0.8 },

      frame: { frames: ["leaf_1", "leaf_2", "leaf_3", "leaf_4"] },
      alpha: 0.5,
      deathZone: {
        type: "onEnter",
        source: new Phaser.Geom.Rectangle(-50, 0, 50, this.scene.game.GH),
      },
      lifespan: 20000,

      speedY: { min: 200, max: 350 },
      speedX: { min: -50, max: -300 },

      frequency: 600,
      reserve: 10,
    })
  }
}
