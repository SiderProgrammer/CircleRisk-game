export default class {
    constructor(scene){
        this.scene = scene
    }
    createFlower(flower){
        return this.scene.add.image(-100,-100,"flowers",flower).setAlpha(0)
      }
    
      flowersEffect(){
        this.scene.flowers.forEach(f=>f
          .setPosition(
            Phaser.Math.Between(100,this.scene.game.GW-100),
            Phaser.Math.Between(100,this.scene.game.GH-100)
            ))
    
            const targets = []
            for(let i=0;i<this.scene.flowers.length-1;++i){
              if(Phaser.Math.Between(0,1)){
                targets.push(this.scene.flowers[i])
              }
            }
    
            this.scene.tweens.add({
              targets,
              alpha:1,
              duration:1000,
              yoyo:true,
              
            })
    
            this.scene.time.addEvent({
              callback:()=>this.flowersEffect(),
              delay:2000,
            })
      }
}