import {createButton} from "./GUI-helper"

export default class HomeButton {
    constructor(config){
        this.scene = config.scene
      this.button = this.createButton(config)
      this.bindMethods()

      return this.button; 
    }
     createButton(config){
        const {scene,func,sprite} = config;

        const button =   createButton(
            scene,
            this.scene.game.GW/2,
            this.scene.game.GH,
            sprite,
            async () => await func(),
            "button"
          )
          .setOrigin(0.5, 1)

          button.y += button.displayHeight
          button.hidden_y = button.y

          return button
    }

    bindMethods(){
      this.button.resetPosition = () => {
        this.resetPosition()
      }

      this.button.animateHide = async () => {
       await this.animateHide()
      }

      this.button.animateShow = async () => {
        await this.animateShow()
      }
    }

    resetPosition() {
        this.button.y = this.button.hidden_y;
        return this.button
        }

        animateHide(){
            return new Promise((resolve) => {
                this.scene.tweens.add({
                  targets: this.button,
                  ease: "Sine.easeIn",
                  y: `+=${this.scene.game.GH}`,
                  duration: 200,
                  onComplete: () =>{
                    resolve()
                    return this.button
                    
                  } ,
                })
              }) 
        }


        animateShow(){
          return new Promise((resolve) => {
            this.scene.tweens.add({
                targets: this.button,
                duration: 250,
                ease: "Sine",
                y: this.scene.game.GH - 20,
                onComplete:()=>{
                  resolve()
                  return this.button
                }
              })
              
          })
        }

}
