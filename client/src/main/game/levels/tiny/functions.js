export default class {
  constructor(scene) {
    this.scene = scene
  }
  resizeTargets() {
    this.scene.manager.target_array.forEach((t) => t.setScale(0.5))
  }

  createVanishingStars(){
    
  this.scene.add.particles("pentagon").createEmitter({
      x: { min: 0, max: this.scene.game.GW },
      y: { min: 0, max: this.scene.game.GH },

      //  angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 1.5 },

      alpha: { start: 0.5, end: 0 },

      lifespan: 1500, // { min, max }, or { min, max, steps }

      speedX: { min: -20, max: 20 },
      speedY: { min: -20, max: 20 },

      frequency: 200,
      reserve: 10,
    })

   
  }
}
