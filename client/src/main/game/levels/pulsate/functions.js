export default class {
  constructor(scene) {
    this.scene = scene
  }
  makeTargetsPulse() {
    this.scene.manager.target_array.forEach((t) => t.setAlpha(1))
    this.scene.tweens.add({
      targets: this.scene.manager.target_array,
      alpha: 0,
      duration: 800,
      yoyo: true,
      hold: 300,
      repeat: -1, // make maybe some stop on yoyo 500 ms or smth
    })
  }

  createComets(){
   this.scene.add.particles("comet").createEmitter({
      x:this.scene.game.GW * 1.3,
      y: {min:50,max:this.scene.game.GH-50},

  
      alpha: 0.5,
      deathZone: {
        type: "onEnter",
        source: new Phaser.Geom.Rectangle(-150, 0, 50, this.scene.game.GH),
      },

  
      speedX: { min: -200, max: -300 },
      lifespan:10000,
      frequency: 1300,
      reserve: 6,
   
    })
  }
}
