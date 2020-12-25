import { createBackground,createButton } from "../GUI-helper"

export default class UpdateGame extends Phaser.Scene {
  constructor() {
    super("updateGame")
  }

  create() {
    createBackground(this, "black-bg")
    createBackground(this, "black-bg")



      const text = this.add.text(
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
      console.log(text)

     const finger = this.add
      .sprite(this.game.GW / 2 + 100, text.y + text.displayHeight +250, "fingers", 0)
      this.tweens.add({
          targets:finger,
          y:"+=100",
          yoyo:true,
          repeat:-1,
          duration:500,
      })

      createButton(this,this.game.GW/2,finger.y + finger.displayHeight/2 + 50 + 50,"update-button",
      ()=>{
        window.open("https://play.google.com/store/apps/details?id=com.pip.circlerisk", "_blank")
      })
  }
}
