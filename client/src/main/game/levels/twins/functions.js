export default class {
  constructor(scene) {
    this.scene = scene
  }
  handleFakeTargetToCatch() {
    this.removeFakeTarget()
    const fake_target_index = this.calculateFakeTargetIndex()
    this.setFakeTargetToCatch(fake_target_index)
  }

  setFakeTargetToCatch(index) {
    this.scene.fake_target = this.scene.manager.target_array[index]
    this.scene.fake_target.setTexture(
      this.scene.manager.target_to_catch_texture
    )
  }

  calculateFakeTargetIndex() {
    let index_shift = 0
    Phaser.Math.Between(0, 1) === 1 ? (index_shift = 1) : (index_shift = -1) /// can assign index shift to 1 and change only if != 1

    let index = this.scene.manager.next_target + index_shift
    if (index === this.scene.manager.current_target) index += 2

    if (index > this.scene.manager.config.targets_amount - 1) {
      index = Phaser.Math.Between(
        1,
        index - this.scene.manager.config.targets_amount - 1
      )
    } else if (index < 0) {
      index = this.scene.manager.config.targets_amount + index
    }

    return index
  }

  removeFakeTarget() {
    this.scene.fake_target.setTexture(this.scene.manager.target_texture)
  }
}
