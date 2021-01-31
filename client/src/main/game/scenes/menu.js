import * as helper from "../GUI-helper"
import { saveProgress, getProgress } from "../../shortcuts/save"
import {
  GET_ACCOUNT_PROGRESS,
  GET_CONFIGURATIONS,
  GET_ACCOUNT_SCORES
} from "../../shortcuts/requests"

import convertData from "../../convertData"
import { START_FETCHING_SCENE, STOP_FETCHING_SCENE } from "../../fetch-helper"
import checkConnection from "../../network-status"
import { START_UPDATE_GAME_SCENE } from "../../fetch-helper"
import accountCreator from "../../account-creator"

export default class menu extends Phaser.Scene {
  constructor() {
    super("menu")
    this.is_everything_fetched = false
    this.is_hidden = false;
    this.tween_duration = 300
  }

  async init({GAME_VERSION_PROMISE}) {
   this.GAME_VERSION_PROMISE = GAME_VERSION_PROMISE

   this.executedAccountCreator = false;
    this.bubbles = []
    this.elements_to_hide_to_levelselect = []

    this.hidden_positions_y = {
      logo: 0,
      play_button: 0,
      customize_button: 0,
      middle_button: 0,
      sound_button: 0,
    }

    if (!this.is_everything_fetched) {
 

      this.game.audio.music.menu_theme.play()

      document.addEventListener("focus",()=>{
        this.game.audio.music.menu_theme.resume()
      });

      document.addEventListener("blur",()=>{
        this.game.audio.music.menu_theme.pause()
      });
      

      this.events.on("wake", () => this.game.audio.music.menu_theme.play())
      this.events.on("sleep", () => this.game.audio.music.menu_theme.stop())
      START_FETCHING_SCENE(this)
      checkConnection(this)
      this.fetchFromServerAndLaunchScenes()
     

    }
  }

  create() {

    
    this.createBackground()
    this.createDecorations()

    this.createInstagram()
    this.createPlayButton()
    this.createCustomizeButton()
    this.createMuteButton()
    this.createMusicButton()
    this.createMiddleButton()
    this.createProfileButton()
    this.createAchievementsButton()
    this.createGearButton()

    this.createFlyingBubbles()

    this.animateShowMenu()
    this.add.text(5,5,"BETA",{font:"30px LuckiestGuy"}).setOrigin(0,0)
  
    
  }

  update() {
    this.updateBubbles()
  }

  async animateShowMenu() {
    this.setAnimatedObjectsActive()
    this.is_hidden = false;
    const ease = "Sine"

    this.showInstagram()
    this.showLogo(ease)

    await this.showPlayButton(ease)
    this.showBottomButtons(ease)
   
  }

  async animateHideMenu() {
    this.is_hidden = true;
    const ease = "Sine.easeIn"

    this.hideInstagram()
    await this.hideButtonsAndLogo(ease)
    this.resetPositionsToHidden()
    this.setAnimatedObjectUnactive()
    this.resetGearHiddenButton(this.sound_button)
    this.resetGearHiddenButton(this.music_button)
    //   return new Promise((resolve) => resolve())
  }
setAnimatedObjectUnactive(){
  [this.instagram_button,
    this.customize_button,
    this.gear_button,
          this.play_button,
          this.middle_button,
          this.logo,
  ]
  .forEach(o=>o.setVisible(false).setActive(false))

}

setAnimatedObjectsActive(){
  [this.instagram_button,
    this.customize_button,
    this.gear_button,
          this.play_button,
          this.middle_button,
          this.logo,
  ]
  .forEach(o=>o.setVisible(true).setActive(true))

}

  launchScenes() {
    return new Promise(resolve=>{
      this.scene.launch("levelSelect")
      this.scene.get("levelSelect").createLevelSelectElementsInMenuContext(this)
  
      this.scene.sleep("levelSelect")
  
      this.scene.launch("customize")
      this.scene.sleep("customize")

      this.scene.launch("profile")
      this.scene.sleep("profile")
      setTimeout(resolve,2000); // timeout to fully launch game
 
    })
   
  }
setBubblesDarkMode(){
  this.bubbles.forEach(bubble=>bubble.setFrame("dark-bubble"))
  this.bubbles_mode = "dark"
}

setBubblesWhiteMode(){
    this.bubbles.forEach(bubble=>bubble.setFrame("bubble"))
  this.bubbles_mode = "white"
}

  updateBubbles() {
    this.bubbles.forEach((bubble) => {
      bubble.y -= bubble.speedY
      bubble.x += bubble.speedX
    })
  }

  resetPositionsToHidden() {
    for (const element in this.hidden_positions_y) {
      eval(`this.${[element]}.y = ${this.hidden_positions_y[element]}`)
    }
    this.play_button.y = this.hidden_positions_y.play_button
    this.logo.y = this.hidden_positions_y.logo

    this.resetButtonsPositionsToHidden()

    return this
  }

  resetButtonsPositionsToHidden(){
    this.customize_button.y = this.hidden_positions_y.customize_button
    this.gear_button.y = this.hidden_positions_y.gear_button

    this.middle_button.y = this.hidden_positions_y.middle_button
  }

  createBackground() {
    this.background = helper.createBackground(this, "menu-bg")
    this.elements_to_hide_to_levelselect.push(this.background)
  }

  createDecorations() {
    this.elements_to_hide_to_levelselect.push(
      this.add.image(
        this.game.GW / 2,
        this.game.GH / 2,
        "general-2",
        "bubbles-menu"
      )
    )

    this.elements_to_hide_to_levelselect.push(
      helper.setGameSize(
        this.add
          .image(this.game.GW / 2, this.game.GH, "general-2", "menu-2")
          .setOrigin(0.5, 1),
        true
      )
    )

    this.elements_to_hide_to_levelselect.push(
      helper.setGameSize(
        this.add
          .image(this.game.GW / 2, this.game.GH, "general-2", "menu-1")
          .setOrigin(0.5, 1),
        true
      )
    )

    this.logo = this.add
      .image(this.game.GW / 2, this.game.GH, "general-2", "circlerisk")
      .setOrigin(0.5, 0)
    this.hidden_positions_y.logo = this.logo.y
  }

  createMuteButton() {
    const mute = () => {
      this.sound_button.setFrame("unmute-button")
      Object.values(this.game.audio.sounds).forEach((sound) =>
        sound.setMute(true)
      )
    }

    const unmute = () => {
      this.sound_button.setFrame("mute-button")
      Object.values(this.game.audio.sounds).forEach((sound) =>
        sound.setMute(false)
      )
    }

    this.sound_button = helper
      .createButton(
        this,
        0,
        0,
        "mute-button",

        () => {
          this.sound_button.frame.name === "mute-button" ? mute() : unmute()
        },
        "button"
      )

     .setAlpha(0)


  }

  createMusicButton() {
    const mute = () => {
      this.music_button.setFrame("music-unmute-button")
      Object.values(this.game.audio.music).forEach((music) =>
        music.setMute(true)
      )
    }

    const unmute = () => {
      this.music_button.setFrame("music-mute-button")
      Object.values(this.game.audio.music).forEach((music) =>
        music.setMute(false)
      )
    }

    this.music_button = helper
      .createButton(
        this,
       0,
       0,
        "music-mute-button",

        () => {
          this.music_button.frame.name === "music-mute-button"
            ? mute()
            : unmute()
        },
        "button"
      )

      .setAlpha(0)

  }

  createMiddleButton(){
  
    this.middle_button = helper
      .createButton(
        this,
        this.game.GW / 2,
        this.game.GH,
        "profile-button",

        () => {
          if(this.profile_button.alpha === 0){
            this.showMiddleSlidingButton({
              button:this.profile_button,
              ease:"Power1",
              duration:350,
              side:"left",
            })

            this.showMiddleSlidingButton({
              button:this.achievements_button,
              ease:"Power1",
              duration:350,
              side:"right",
            })

            this.middle_button.setAlpha(0.5)
          }else{
              this.hideMiddleSlidingButton({
              button:this.profile_button,
              ease:"Power1",
              duration:350,
              side:"left",
            })
            
            this.hideMiddleSlidingButton({
              button:this.achievements_button,
              ease:"Power1",
              duration:350,
              side:"right",
            })

            this.middle_button.setAlpha(1)
          }
          
        },
        "button"
      )

      .setOrigin(0.5, 1)

    this.middle_button.y += this.middle_button.displayHeight
    this.hidden_positions_y.middle_button = this.middle_button.y
  }

showGearSlidingButton(config){
  const {button,ease,duration,shift_y,sign,callback} = config;


  this.resetGearHiddenButton(button);

  this.tweens.add({
    targets:button,
    ease,
    duration,
   
    y:`${sign}=${shift_y}`,
    alpha:1,
    scale:1,
onComplete:callback
  })

}

hideGearSlidingButton(config){
  const {button,ease,duration,shift_y,sign,callback} = config;

  this.tweens.add({
    targets:button,
    ease,
    duration,
    y:`${sign}=${shift_y}`,
    alpha:0,
    scale:0,
onComplete:callback
  })

}
  createGearButton(){
    let can_click = true;
    this.gear_button = helper
    .createButton(
      this,
      this.game.GW - 25,
      this.game.GH,
      "gear-button",

      () => {
        if(!can_click) return
        can_click = false;

        if(this.sound_button.alpha === 0){
          this.showGearSlidingButton({
            button:this.music_button,
            ease:"Power1",
            duration:350,
            shift_y:"410",
            sign:"-"
          })

          this.time.addEvent({
            callback:()=>{
              this.showGearSlidingButton({
                button:this.sound_button,
                ease:"Power1",
                duration:350,
                shift_y:"240",
                sign:"-",
                callback:function(){can_click = true}
              })
    
            },
            delay:100
          })
      
          this.gear_button.setAlpha(0.5)
        }else{

          this.hideGearSlidingButton({
            button:this.sound_button,
            ease:"Power1",
            duration:350,
            shift_y:"240",
            sign:"+"
          })

          this.time.addEvent({
            callback:()=>{
            this.hideGearSlidingButton({
              button:this.music_button,
              ease:"Power1",
              duration:350,
              shift_y:"410",
              sign:"+",
              callback:function(){can_click = true}
            })
          },
          delay:100
        })

            this.gear_button.setAlpha(1)  
        
      }
      },
      "button"
    )

    .setOrigin(1, 1)

  this.gear_button.y += this.gear_button.displayHeight
  this.hidden_positions_y.gear_button = this.gear_button.y
  }

  resetGearHiddenButton(button){
    
    button.x = this.gear_button.x - this.gear_button.displayWidth/2
    button.y = this.gear_button.y
    button.setAlpha(0);
    button.setScale(0);
  
  }

resetMiddleHiddenButton(button){
  button.x = this.middle_button.x
  button.y = this.middle_button.y
  button.setAlpha(0);
  button.setScale(0);

}
  showMiddleSlidingButton(config){
    let x_sign,y_sign = ""
if(config.side === "left"){
  x_sign = "-";
  y_sign = "-";
}else{
  x_sign = "+"
  y_sign = "-"
}

    const button = config.button

    this.resetMiddleHiddenButton(button);

    this.tweens.add({
      targets:button,
      alpha:1,
      scale:1,
      x:`${x_sign}=90`,
      y:`${y_sign}=200`,
      duration:config.duration,
      ease:config.ease,
    })
  }

  
  hideMiddleSlidingButton(config){
    let x_sign,y_sign = ""
    if(config.side === "left"){
      x_sign = "+";
      y_sign = "+";
    }else{
      x_sign = "-"
      y_sign = "+"
    }

    this.tweens.add({
      targets:config.button,
      alpha:0,
      scale:0,
      x:`${x_sign}=90`,
      y:`${y_sign}=200`,
      duration:config.duration,
      ease:config.ease,
    })
  }

  createProfileButton(){
    this.profile_button = helper.createButton(
      this,
      0,0,"profile-button",async ()=>{
        await this.animateHideMenu()
          
        this.scene.wake("profile")
        await this.scene.get("profile").animateProfileShow()
        

      },"button"
    ).setAlpha(0)
  }
  createAchievementsButton(){
    this.achievements_button = helper.createButton(
      this,
      0,0,"medal-button",async ()=>{
        const text = this.add.text(this.achievements_button.x,this.achievements_button.y,"Achievements coming soon",{
          font:"50px LuckiestGuy"
        }).setOrigin(0.5)
  
        this.tweens.add({
          targets:text,
          y:"-=230",
          duration:1500,
          alpha:0,
          onComplete:()=>text.destroy()
          
        })

      },"button"
    ).setAlpha(0)
  }

  createBubble(x, y) {
    const bubble = this.add.image(x, y, "general-2", "bubble")
    if(this.bubbles_mode === "dark") bubble.setFrame("dark-bubble")

    this.bubbles.push(bubble)

    bubble.fly_direction = 1

    bubble.speedY = Phaser.Math.FloatBetween(0.3, 0.8)
    bubble.speedX = Phaser.Math.FloatBetween(0.1, 0.3)

    if (Phaser.Math.Between(0, 1)) bubble.fly_direction = -1

    this.time.addEvent({
      delay: Phaser.Math.Between(1500, 3000),
      loop: true,
      callback: () => {
        bubble.speedX *= -1
      },
    })

    this.time.addEvent({
      delay: Phaser.Math.Between(5000, 30000),
      callback: () => {
        this.tweens.add({
          targets: bubble,
          alpha: 0,
          duration: 1500,
          onComplete: () => {
            this.bubbles.splice(
              this.bubbles.findIndex((bubble) => !bubble.active),
              1
            )
            bubble.destroy()
          },
        })
      },
    })

    bubble.setAlpha(0).setScale(Phaser.Math.Between(3, 10) / 10)

    this.tweens.add({ targets: bubble, alpha: 0.6, duration: 300 })

    return bubble
  }

  createFlyingBubbles() {
    for (let i = 0; i < 15; i++) {
      this.createBubble(
        Phaser.Math.Between(0, this.game.GW),
        Phaser.Math.Between(this.game.GH / 2 - 200, this.game.GH - 100)
      )
    }

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callbackScope: this,

      callback: () => {
        this.createBubble(
          Phaser.Math.Between(0, this.game.GW),
          Phaser.Math.Between(this.game.GH - 50, this.game.GH - 150)
        )
      },
    })
  }

  createInstagram() {
    this.instagram_button = helper
      .createButton(
        this,
        this.game.GW - 20,
        20,
        "instagram",
        () => {
          window.open("https://www.instagram.com/pip_games/", "_blank")
        },
        "button"
      )
      .setOrigin(1, 0)
  }

  createCustomizeButton() {
    this.customize_button = helper
      .createButton(
        this,
        25,
        this.game.GH,
        "customize-button",
        async () => {
          await this.animateHideMenu()
          
          this.scene.get("customize").animateCustomizeShow()
          this.scene.wake("customize")
     
        },
        "button"
      )

      .setOrigin(0, 1)

    this.customize_button.y += this.customize_button.displayHeight
    this.hidden_positions_y.customize_button = this.customize_button.y
  }

  hideElementsSharedWithLevelSelect() {
    this.elements_to_hide_to_levelselect.forEach((element) =>
      element.setActive(false).setVisible(false)
    )
  }

  showElementsSharedWithLevelSelect() {
    this.elements_to_hide_to_levelselect.forEach((element) =>
      element.setActive(true).setVisible(true)
    )
  }
  createPlayButton() {
    this.play_button = helper.createButton(
      this,
      this.game.GW / 2,
      this.game.GH,
      "play-button-big",

      async () => {
        if (!this.can_play) return
        this.can_play = false

        await this.animateHideMenu()

        this.hideElementsSharedWithLevelSelect()
        
        this.scene
          .get("levelSelect")
          .showAllElementsInMenuContext(this)
          .animateLevelSelectShow()
          this.scene.wake("levelSelect")

      },
      "button"
    )

    this.play_button.y += this.play_button.displayHeight
    this.hidden_positions_y.play_button = this.play_button.y
  }

  showInstagram() {
    this.instagram_button.setAlpha(0)
    this.tweens.add({
      targets: this.instagram_button,
      alpha: 1,
      duration: 250,
    })
  }

  showLogo(ease) {
    this.tweens.add({
      targets: this.logo,
      y: 70,
      duration: 400,
      ease,
    })
  }

  showPlayButton(ease) {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: this.play_button,
        y: this.game.GH / 2 + 35,
        duration: 400,
        ease,
        onComplete: () => {
          resolve()
          this.can_play = true
        },
      })
    })
  }

  animateBottomButton(button, ease) {
    this.tweens.add({
      targets: button,
      ease,
      duration: 300,
      y: this.game.GH - 25,
      onComplete:()=>{
        if(this.is_hidden){
          this.resetButtonsPositionsToHidden()
        }
      }
    })
  }

  showBottomButtons(ease) {
    if (!this.can_play) return

    this.animateBottomButton(this.customize_button, ease)

    this.time.addEvent({
      delay: 50,
      callback: () => {
        this.animateBottomButton(this.middle_button, ease)
      },
    })

    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.animateBottomButton(this.gear_button, ease)
      },
    })
  }

  hideInstagram() {
    this.tweens.add({
      targets: this.instagram_button,
      alpha: 0,
      duration: 200,
    })
  }

  hideButtonsAndLogo(ease) {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: [
          this.customize_button,
          this.sound_button,
          this.gear_button,
          this.play_button,
          this.middle_button,
          this.achievements_button,
          this.profile_button,
          this.logo,
          this.music_button,
          this.sound_button
        ],
        ease: ease,
        y: `+=${this.game.GH}`,
        duration: 200,

        onComplete: () =>{
          //this.resetMiddleHiddenButton(this.achievements_button);
         // this.resetMiddleHiddenButton(this.profile_button);
          this.middle_button.setAlpha(1);
          this.gear_button.setAlpha(1)

          resolve()
        } ,
      })
    })
  }

  async fetchFromServerAndLaunchScenes() { 
   let timeout;

    try {
      await this.restoreProgress()
/// SPAGHETII CODE * TODO * REDESIGN THIS PART 
      if(window.progress === null && !this.executedAccountCreator){ 
        // if acount was removed from database and the user had account before
        this.executedAccountCreator = true;

        localStorage.clear();
        accountCreator(false)
        throw new Exception(); // force catch  {}
        
      } else if(window.progress === null){ // must be null
        throw new Exception(); // force catch  {}
      }

      await this.getConfigurations()
     
      convertData();

      await this.launchScenes()

      this.finishFetching()

      const SERVER_GAME_VERSION = await this.GAME_VERSION_PROMISE
      if( window.CLIENT_GAME_VERSION < SERVER_GAME_VERSION){
       
        START_UPDATE_GAME_SCENE(this)
        clearTimeout(timeout)
        return;
      }

      
      
    } catch{

      if(!window.is_server_alive) return;
      timeout = setTimeout(() => {
        this.fetchFromServerAndLaunchScenes()
      }, 3000)
    }
  }

  async getConfigurations() {
    const response = await GET_CONFIGURATIONS()
    // WINDOW ASSIGNED VARIABLES LIKE NICKNAME CAN BE EASY HACKED  !!!
    window.customize_skins_setup = response.skins_setup
    window.levelsConfiguration = response.levels_config
  }

  async restoreProgress() {
    window.my_nickname = getProgress().nickname
  
    window.progress = await GET_ACCOUNT_PROGRESS({ nickname: my_nickname })

    if(!window.progress) return

  window.progress.levels_scores = await GET_ACCOUNT_SCORES({nickname:my_nickname})
 
  }


  finishFetching() {
    this.is_everything_fetched = true
    STOP_FETCHING_SCENE(this)
    this.setBubblesWhiteMode()
  }
}
