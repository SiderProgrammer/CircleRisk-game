export default class {
  constructor(scene) {
    this.scene = scene
  }

  createFlyingCubes() {
    const emitter = this.scene.add.particles("particles").createEmitter({
      x: { min: 50, max: this.scene.game.GW - 50 },
      y: this.scene.game.GH + 100,

      angle: { min: 0, max: 360 },
      scale: { min: 0.3, max: 0.5 },

      frame: { frames: ["cube_1", "cube_2", "cube_3", "cube_4"] },
      alpha: 0.5,
      deathZone: {
        type: "onEnter",
        source: new Phaser.Geom.Rectangle(0, -50, this.scene.game.GW, 50),
      },
      lifespan: 10000, // { min, max }, or { min, max, steps }

      speedY: { min: -200, max: -300 },

      frequency: 1700,
      reserve: 10,
      delay: 2500,
    })

    emitter.scaleX.onUpdate = emitter.scaleX.defaultUpdate
  }
}
