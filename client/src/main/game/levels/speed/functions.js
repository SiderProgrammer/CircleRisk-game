export default class {
    constructor(scene){
        this.scene = scene
    }
    showLightning(){
        const duration = Phaser.Math.Between(200,450)
        const props = {
          x:0,
          y:0,
          originX:0,
          originY:0,
          flipX:false,
          angle:0,
        }
  
        if(Phaser.Math.Between(0,1)){
          props.y = Phaser.Math.Between(150,this.scene.game.GH-150)
          props.originY = 0.5;
  
          if(Phaser.Math.Between(0,1)){
            props.x = 0
            props.originX = 0
            props.flipX = true;
          }else{
            props.x = this.scene.game.GW
            props.originX = 1;
          }
  
        }else{
            props.x = Phaser.Math.Between(150,this.scene.game.GW-150)
            props.originX = 0.5;
  
            if(Phaser.Math.Between(0,1)){
              props.y = this.scene.game.GH - this.scene.lightning.displayHeight/2
              props.originY = 0
              props.angle = 90
            }else{
              props.y = this.scene.lightning.displayHeight/2
              props.originY = 1
              props.angle = -90
            }
        }
         
            this.scene.lightning.setPosition(props.x,props.y)
            .setOrigin(props.originX,props.originY)
            .setFlipX(props.flipX)
            .setAngle(props.angle)
  
            this.scene.tweens.add({
              targets:this.scene.lightning,
              alpha:1,
              yoyo:true,
              duration,
              onComplete:()=>{
                this.scene.time.addEvent({
                  delay:Phaser.Math.Between(2000,4000),
                  callback:()=>this.showLightning(),
                })
              }
            })
  
  
          
      }
  
}