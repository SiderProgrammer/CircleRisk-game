import { createBackground,createButton } from "../GUI-helper"

export default class UpdateGame extends Phaser.Scene {
  constructor() {
    super("updateGame")
  }

  create() {
    createBackground(this, "black-bg")
    createBackground(this, "black-bg")



      this.add.text(
        this.game.GW / 2,
        100,
        "Your game version is out of date. Please update it from the Google Play Store",
        {
          font: `70px ${main_font}`,
          wordWrap: {
            width: this.game.GW * 0.8,
          },
          align: 'center', 
        }
      )
      .setOrigin(0.5,0)

     const finger = this.add
      .sprite(this.game.GW / 2, this.game.GH/2-50, "fingers", 0)
      this.tweens.add({
          targets:finger,
          y:"+=100",
          yoyo:true,
          repeat:-1,
          duration:500,
      })

      createButton(this,this.game.GW/2,finger.y + finger.displayHeight/2 + 50 + 20,"play-button",
      ()=>{
        window.open("https://play.google.com/store/apps/details?id=com.pip.circlerisk", "_blank")
      })
  }
}
