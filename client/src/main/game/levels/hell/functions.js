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
}
