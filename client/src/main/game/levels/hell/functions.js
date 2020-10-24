export default class {
  constructor(scene) {
    this.scene = scene
    this.are_targets_hidden = false
  }
  hideTargets() {
    if (this.are_targets_hidden) return
    this.scene.manager.target_array.forEach((t) => t.setVisible(false))
    this.are_targets_hidden = true
  }

  createBlame() {
    this.scene.add.particles("flame").createEmitter({
      x: { min: 0, max: this.scene.game.GW },
      y: this.scene.game.GH,

      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },

      alpha: { start: 1, end: 0 },

      lifespan: 1500, // { min, max }, or { min, max, steps }

      speedY: { min: -200, max: -300 },

      frequency: 50,
      reserve: 20,
    })
  }
}
