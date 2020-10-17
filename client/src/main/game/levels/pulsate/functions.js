export default class {
  constructor(scene) {
    this.scene = scene
  }
  makeTargetsPulse() {
    this.scene.tweens.add({
      targets: this.scene.manager.target_array,
      alpha: 1,
      duration: 800,
      yoyo: true,
      repeat: -1, // make maybe some stop on yoyo 500 ms or smth
    })
  }
}
