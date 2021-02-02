export default class {
    constructor(scene){
        this.scene = scene;
    }
    swapTargetToTheNearset(){
        this.scene.manager.next_target  = this.scene.manager.current_target+1;
    }
    hideFoot(){
        this.scene.tweens.add({
          targets:this.scene.foot,
          alpha:0,
          duration:1000,
          onComplete:()=>{
            this.scene.time.addEvent({
              delay:2000,
              callback:()=>{
                const x = Phaser.Math.Between(100,this.scene.game.GW-100)
                const y=Phaser.Math.Between(100,this.scene.game.GH-100)
                const angle = Phaser.Math.Between(0,360)
                this.scene.foot.setPosition(x,y).setAlpha(1).setAngle(angle)
                this.hideFoot()
              }
            })
          }
        })
      }
}