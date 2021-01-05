export default class {
  constructor(scene) {
    this.scene = scene
  }
  changeRotationSpeed() {
    const { max, min } = this.scene.manager.config.rotation_speed_change
    this.scene.manager.rotation_speed = Phaser.Math.FloatBetween(min, max)
  }
}
