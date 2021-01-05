export default class {
  constructor(scene) {
    this.scene = scene
  }
  shake() {
    this.scene.cameras.main.shake(500, 0.05)
  }
}
