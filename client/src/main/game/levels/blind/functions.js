export default class {
  constructor(scene) {
    this.scene = scene
  }
  blindTheScreen() {
    this.scene.blind.setVisible(true)

    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.blind.setVisible(false)
        this.scene.time.addEvent({
          delay: Phaser.Math.Between(4000, 7000),
          callback: this.blindTheScreen,
          callbackScope: this,
        })
      },
    })
  }
}
