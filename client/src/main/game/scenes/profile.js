//import {createButton} from "../GUI-helper"
import HomeButton from "../down-home-button"

export default class Profile extends Phaser.Scene {
    constructor(){
        super("profile")
    }

    create(){
        this.profile_guy = this.createProfileGuy(this.game.GW-50,50)

        this.createNickname({
            x:(this.game.GW - this.profile_guy.displayWidth-50)/2,
            y:this.profile_guy.y + this.profile_guy.displayHeight/2,
            font:"70px LuckiestGuy"
        })

       this.stats_buttons = this.createStatsButtons({
            left_x:100,
            right_x:this.game.GW/2 + 100,
            space_y:170,
            first_row_y: this.profile_guy.y + this.profile_guy.displayHeight + 100
        })

        this.createStatsNumbers({
            left_x:this.stats_buttons.wins.x + this.stats_buttons.wins.displayWidth/2 + 20,
            right_x:this.stats_buttons.deaths.x + this.stats_buttons.deaths.displayWidth/2 + 20,
            font:"50px LuckiestGuy"
        })

      this.total =  this.createTotal({
            x:this.game.GW/2,
            y:this.stats_buttons.achievements.y + 200,
            font:"60px LuckiestGuy",
            space:60,
        });

        this.createStatus({
            x:this.game.GW/2,
            y:this.total.y + 150,
            font:"60px LuckiestGuy",
            space:60,
        })

        this.home_button = this.createHomeButton()
    }
    createButton(x,y,sprite,func){
        return this.add.image(x,y,"profile",sprite,()=>func())
    }
    createProfileGuy(x,y){
        return this.add.image(x,y,"profile").setOrigin(1,0)
    }
    createNickname(config){
        const {x,y,font} = config;
        return this.add.text(x,y,my_nickname,{font}).setOrigin(0.5,0.5)
    }
    createStatsButtons(config){
        const {left_x,right_x,first_row_y,space_y} = config
        return {
            wins:this.createWinsButton(left_x,first_row_y),
            deaths:this.createDeathsButton(right_x,first_row_y),
            hits:this.createHitsButton(left_x,first_row_y+space_y),
            perfects:this.createPerfectsButton(right_x,first_row_y+space_y),
            achievements:this.createAchievementsButton(left_x,first_row_y+space_y*2),
            perfect_rate:this.createPerfectRateButton(right_x,first_row_y+space_y*2),
        }
    }
  
    createWinsButton(x,y){
        return this.createButton(x,y,"wins-icon",()=>{})
    }
    createDeathsButton(x,y){
        return this.createButton(x,y,"deaths-icon",()=>{})
    }

    createHitsButton(x,y){
        return this.createButton(x,y,"hit-icon",()=>{})
    }
    createPerfectsButton(x,y){
        return this.createButton(x,y,"perfect-icon",()=>{})
    }

    createAchievementsButton(x,y){
        return this.createButton(x,y,"achievements-icon",()=>{})
    }
    createPerfectRateButton(x,y){
        return this.createButton(x,y,"perfect-rate-icon",()=>{})
    }

    createStatsNumbers(config){
        const {left_x,right_x,font} = config
        const {wins,deaths,hits,perfects,achievements,perfect_rate} = this.getStatsNumbers()
        
        return {
            wins:this.add.text(left_x,this.stats_buttons.wins.y,wins,{font}).setOrigin(0,0.5),
            deaths:this.add.text(right_x,this.stats_buttons.deaths.y,deaths,{font}).setOrigin(0,0.5),
            hits:this.add.text(left_x,this.stats_buttons.hits.y,hits,{font}).setOrigin(0,0.5),
            perfects:this.add.text(right_x,this.stats_buttons.perfects.y,perfects,{font}).setOrigin(0,0.5),
            achievements:this.add.text(left_x,this.stats_buttons.achievements.y,achievements,{font}).setOrigin(0,0.5),
            perfect_rate:this.add.text(right_x,this.stats_buttons.perfect_rate.y,perfect_rate,{font}).setOrigin(0,0.5)
        }
    }

    getStatsNumbers(){
        return {
            wins:this.getWinsNumber(),
            deaths:this.getDeathsNumber(),
            hits:this.getHitsNumber(),
            perfects:this.getPerfectsNumber(),
            achievements:this.getAchievementsNumber(),
            perfect_rate:this.calculatePerfectRate()
        }
    }
getWinsNumber(){
  
  const wins_number =  levelsConfiguration.filter((level,i)=>{
        return progress.levels_scores[i] >= level.info.score_to_next_level  
    }).length

    return Number((wins_number / levelsConfiguration.length * 100).toFixed(2)) + "%";
}

getDeathsNumber(){
    return progress.deaths || 0 
}

getHitsNumber(){
    return progress.hits || 0
}
getPerfectsNumber(){
    return progress.perfects || 0 
}

getAchievementsNumber(){
    return progress.achievements || 0
}
calculatePerfectRate(){
    return Number((this.getPerfectsNumber / this.getHitsNumber()  * 100 ).toFixed(2)) + "%" 
}

createTotal(config){
    const {x,y,font,space} = config
    this.add.text(x,y,"Total",{font}).setOrigin(0.5);
   return this.add.text(x,y+space,this.calculateTotal(),{font}).setOrigin(0.5);
}
calculateTotal(){
    return 0;
}

createStatus(config){
    const {x,y,font,space} = config
    this.add.text(x,y,"Status",{font}).setOrigin(0.5);
   return this.add.text(x,y+space,this.getStatus(),{font}).setOrigin(0.5);
}
getStatus(){
    return "NOOB"
}

createHomeButton() {
  return new HomeButton({
       scene:this,
        sprite:"home-button",

        func:async ()=>{
          await this.animateProfileHide()

          this.home_button.resetPosition()
          this.scene.get("menu").animateShowMenu()
          this.scene.sleep()
        }
     })
  }

  async animateProfileShow(){
    await this.home_button.animateShow();
  }

  async animateProfileHide(){
    await this.home_button.animateHide();
    this.home_button.resetPosition()
    this.scene.get("menu").animateShowMenu()
    this.scene.sleep()
  }

  
}

