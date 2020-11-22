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
}
