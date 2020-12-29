export default class {
  constructor(scene) {
    this.scene = scene
  }
  handleFakeTargetsToCatch() {
    if (this.scene.fake_targets.length > 0) {
      this.scene.fake_targets.forEach((target) => {
        this.removeFakeTargetTexture(target)
      })
    }

    const fake_targets_amount = Phaser.Math.Between(1, 5)

    for (let i = 0; i < fake_targets_amount; i++) {
      this.scene.fake_targets[i] = Phaser.Math.Between(
        0,
        this.scene.manager.config.targets_amount - 1
      )

      this.setFakeTargetTexture(this.scene.fake_targets[i])
    }
  }

  removeFakeTargetTexture(index) {
    this.scene.manager.target_array[index].setFrame(
      this.scene.manager.target_texture
    )
  }

  setFakeTargetTexture(index) {
    this.scene.manager.target_array[index].setFrame(
      this.scene.manager.target_to_catch_texture
    )
  }

  removeCorrectTargetTextureToCatch() {
    if (Phaser.Math.Between(0, 1) === 1) {
      // 50 percent
      this.scene.manager.target_array[
        this.scene.manager.next_target
      ].setFrame(this.scene.manager.target_texture)
    }
  }
}
