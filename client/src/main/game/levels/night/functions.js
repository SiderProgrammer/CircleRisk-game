export default class {
  constructor(scene) {
    this.scene = scene
  }
  darkenTargets() {
    this.scene.manager.target_array[
      this.scene.manager.current_target
    ].setVisible(true)
    this.scene.manager.target_array.forEach((target) => {
      target.setAlpha(Phaser.Math.Between(15, 50) / 100)
    })

    this.scene.manager.target_array[this.scene.manager.next_target].setVisible(
      false
    )
  }
}
