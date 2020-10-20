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
  createFlyingleafs() {
    this.scene.add.particles("particles").createEmitter({
      x: this.scene.game.GW + 50,
      y: { min: 0, max: 100 },

      angle: { min: 0, max: 360 },
      scale: Math.round(Phaser.Math.FloatBetween(0.6, 0.8) * 10) / 10,

      frame: { frames: ["leaf_1", "leaf_2", "leaf_3", "leaf_4"] },
      alpha: 0.5,
      deathZone: {
        type: "onEnter", //-50
        source: new Phaser.Geom.Rectangle(-50, 0, 50, this.scene.game.GH),
      },
      lifespan: 20000, // { min, max }, or { min, max, steps }

      speedY: { min: 200, max: 350 },
      speedX: { min: -50, max: -300 },

      frequency: 600,
      reserve: 10,
    })
  }
}
