export default class {
    constructor(scene){
        this.scene = scene
    }
    removeTargetToCatchSkin() {
        this.scene.manager.target_array[this.scene.manager.next_target].setFrame(
          this.scene.manager.target_texture
        )
      }
      
  startMoveCockroach(){
    this.moveCockroach()
    this.scene.time.addEvent({
     delay:2500,
     callback:()=>{
  
       this.moveCockroach(true)

       this.scene.time.addEvent({
         delay:6000,
         callback:()=>this.startMoveCockroach()
       })
     }
   })
   }

  moveCockroach(offscreen = false){

    let x = Phaser.Math.Between(150,this.scene.game.GW-100)
    let y= Phaser.Math.Between(150,this.scene.game.GH-100)
    
    if(offscreen){
      Phaser.Math.Between(0,1) ? x = this.scene.game.GW + 100 : x = -100;
     Phaser.Math.Between(0,1) ? y = this.scene.game.GH + 100 : y = -100;
    }

    const angle =  Phaser.Math.RadToDeg(
      Phaser.Math.Angle.BetweenPoints({x,y},{x:this.scene.cockroach.x,y:this.scene.cockroach.y}))
        
    this.scene.cockroach.setAngle(angle - 90)
    
        this.scene.tweens.add({
          targets:this.scene.cockroach,
          x,
          y,
          duration:600,
      
        })

  }
}