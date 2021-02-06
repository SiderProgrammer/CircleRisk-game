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
    if (this.targets.some((target) => this.isBouncingWallX(target))) {
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
  extractBouncingTargets() {
    this.targets = []
    const pos = this.scene.manager.helper.calculateMinMaxTargetsPos()

    this.targets.push(
      this.scene.manager.helper.findTargetIndexByPosition({ x: pos.minX })
    )
    this.targets.push(
      this.scene.manager.helper.findTargetIndexByPosition({ x: pos.x })
    )
  }

  createSweetsEffect(){
    const props = {
      frame: {
        frames: ["sweet_1", "sweet_2", "sweet_3", "sweet_4"],
        cycle: false,
      },
      alpha:0.5,
      speedY: { min: -100, max: -250 },
      gravityY: 450,
      quantity: -1,
       reserve: 7,
     lifespan:5000,
    }

    const emitter = this.scene.add.particles("sweets").createEmitter({
    ...props,
     speedX: { min: 200, max: 300 },
    })

    const emitter_right = this.scene.add.particles("sweets").createEmitter({
     ...props,
     speedX: { min: -200, max: -300 },
    })

const throwSweets = () => {
  if(Phaser.Math.Between(0,1)){
    emitter.explode(
      1,
      -100,
      Phaser.Math.Between(0,this.scene.game.GH/2)
    )
  }else{
    emitter_right.explode(
      1,
    this.scene.game.GW+100,
    Phaser.Math.Between(0,this.scene.game.GH/2))
  }
}

this.scene.time.addEvent({
  delay:2500,
  callback:()=>{
    throwSweets()    
    
    if(Phaser.Math.Between(0,1)){
      throwSweets()
    }
  },

  repeat:-1,
})
    
  }
}
