export default class {
  constructor(scene) {
    this.scene = scene
    this.alpha_state = 1;
  }
  darkenTargets() {
    this.scene.manager.target_array[
      this.scene.manager.current_target
    ].setVisible(true)
    this.scene.manager.target_array.forEach((target) => {
      target.setAlpha(Phaser.Math.Between(15, 50) / 100)
    })

    this.scene.manager.target_array[this.scene.manager.next_target].setAlpha(this.alpha_state)
    this.alpha_state -=0.3;
  }

  createStars(){
const stars = [] 
for(let i=0;i<10;++i){
  stars.push(this.scene.add.image(0,0,"star").setAlpha(0).setScale(0.5))
}
const createStar = () => {
  let y_max = this.scene.game.GH*0.8

  if(Phaser.Math.Between(0,10) >= 6){
    y_max = this.scene.game.GH*0.4
  }

  const x = Phaser.Math.Between(30,this.scene.game.GW-30)
  const y = Phaser.Math.Between(40,y_max)

  let star = {}

  if(stars.length === 0){
   star= stars.push(this.scene.add.image(x,y,"star").setAlpha(0).setScale(0.5))
  }else{
   star=  stars.shift().setPosition(x,y)
  }
  

  this.scene.tweens.add({
    targets:star,
    alpha:0.5,
    scale:1.5,
    yoyo:true,
    duration:1500,
    onComplete:()=>{
      stars.push(star)
    }
  })
}

    this.scene.time.addEvent({
      delay:350,
      repeat:-1,
      callback:()=>createStar()
    })

  }
}
