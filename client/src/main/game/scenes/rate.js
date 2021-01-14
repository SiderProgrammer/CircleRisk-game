import { createBackground,createButton } from "../GUI-helper"

export default class Rate extends Phaser.Scene {
  constructor() {
    super("rate")
  }
init({scene}){
    this.sceneToPause = scene;
}
  create() {
    createBackground(this, "black-bg")
    

        const img = this.add.image(this.game.GW/2,this.game.GH/2,"rate-picture")

     createButton(this,img.x+150,img.y+150,"rate-button",
      ()=>{
        window.open("https://play.google.com/store/apps/details?id=com.pip.circlerisk", "_blank")
        this.scene.stop();
        this.sceneToPause.scene.resume()
      })

       createButton(this,img.x,img.y+img.displayHeight/2+60,"close-button",()=>{
          this.scene.stop()
          this.sceneToPause.scene.resume()
      })
  }
}
