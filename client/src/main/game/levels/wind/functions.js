export default class {
  constructor(scene) {
    this.scene = scene
    this.targets_speed = scene.targets_speed
    this.speed_up_value =  0.03

if(this.scene.manager.config.targets_acceleration)  this.speed_up_value = this.scene.manager.config.targets_acceleration
console.log(this.speed_up_value)

  }
  isBouncingWallX(target) {
    return (
      target.x >= this.scene.game.GW - target.displayWidth / 2 ||
      target.x <= 0 + target.displayWidth / 2
    )
  }
  isBouncingWallY(target) {
    return (
      target.y >= this.scene.game.GH - target.displayHeight / 2 ||
      target.y <= 0 + target.displayHeight / 2
    )
  }

  moveTargetsAndBounceOffWalls() {
    if (this.targetsX.some((target) => this.isBouncingWallX(target))) {
      this.targets_speed.x = -this.targets_speed.x
      this.targets_speed.x > 0
        ? (this.targets_speed.x += this.speed_up_value)
        : (this.targets_speed.x -= this.speed_up_value)
    }

    if (this.targetsY.some((target) => this.isBouncingWallY(target))) {
      this.targets_speed.y = -this.targets_speed.y
      this.targets_speed.y > 0
        ? (this.targets_speed.y += this.speed_up_value)
        : (this.targets_speed.y -= this.speed_up_value)
    }
    this.moveTargetsAndCircles(this.targets_speed)
  }

  moveTargetsAndCircles({ x, y }) {
    this.scene.manager.target_array.forEach((target) => {
      target.x += x
      target.y += y * 2
    })

    const not_rotating_circle = this.scene.manager.circles[
      1 - this.scene.manager.current_circle
    ]

    this.scene.manager.helper.centerStick(this)

    not_rotating_circle.x += x
    not_rotating_circle.y += y * 2
  }
  createFlyingleafs() {
    const emitter = this.scene.add.particles("particles").createEmitter({
      x: this.scene.game.GW + 50,
      y: { min: 0, max: 100 },

      angle: { start: 0, end: 180 },
      scale: { min: 0.6, max: 0.7 },

      frame: { frames: ["leaf_1", "leaf_2", "leaf_3", "leaf_4"] },
      alpha: 0.5,
      deathZone: {
        type: "onEnter",
        source: new Phaser.Geom.Rectangle(-50, 0, 50, this.scene.game.GH),
      },
      lifespan: 5000,

      speedY: { min: 200, max: 350 },
      speedX: { min: -50, max: -300 },

      frequency: 900,
      reserve: 10,
      delay: 2500,
    })

    emitter.scaleX.onUpdate = emitter.scaleX.defaultUpdate
  }

  extractBouncingTargets() {
    this.targetsX = []
    this.targetsY = []

    const pos = this.scene.manager.helper.calculateMinMaxTargetsPos()

    this.targetsX.push(
      this.scene.manager.helper.findTargetIndexByPosition({ x: pos.minX })
    )
    this.targetsX.push(
      this.scene.manager.helper.findTargetIndexByPosition({ x: pos.x })
    )

    this.targetsY.push(
      this.scene.manager.helper.findTargetIndexByPosition({ y: pos.minY })
    )
    this.targetsY.push(
      this.scene.manager.helper.findTargetIndexByPosition({ y: pos.y })
    )
  }
}
