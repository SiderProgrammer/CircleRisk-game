export default class {
  constructor(scene) {
    this.scene = scene
  }
  resizeTargets() {
    this.scene.manager.target_array.forEach((t) => t.setScale(0.5))
  }
}
