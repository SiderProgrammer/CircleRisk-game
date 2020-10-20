export default class {
  constructor(scene) {
    this.scene = scene
  }
  blindTheScreen() {
    this.scene.blind.setVisible(true)
    setTimeout(() => {
      this.scene.blind.setVisible(false)
      // change set timeouts to phaser timer function (setimeout will execute even if level is done)
      setTimeout(() => this.blindTheScreen(), Phaser.Math.Between(4000, 7000))
    }, 1000)
  }
}
