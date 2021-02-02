export default class {
  constructor(scene) {
    this.scene = scene
  }
  blindTheScreen() {
    if (!this.scene.manager.game_started) return

    this.scene.blind.setVisible(true)
    if(this.scene.cross_1)this.changeCrossesPosition()
    
    this.scene.time.addEvent({
      delay: this.scene.manager.config.blind_time || 800,
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

  changeCrossesPosition(){
    const x = Phaser.Math.Between(100,this.scene.game.GW-100)
    this.scene.cross_1.x = x;
  }
}
