//import {createButton} from "../GUI-helper"
import {getProgress} from "../../shortcuts/save"
import HomeButton from "../down-home-button"

export default class Profile extends Phaser.Scene {
    constructor(){
        super("profile")

        this.stats = this.getStats()
        this.ranks = this.getRanks()
    }
    getStats(){
      return  getProgress().stats || {};
    }
 
    
    create(){
        this.profile_guy = this.createProfileGuy(this.game.GW-20,20)

        this.nickname = this.createNickname({
            x:(this.game.GW - this.profile_guy.displayWidth-50)/2,
            y:this.profile_guy.y + this.profile_guy.displayHeight/2,
            font:"70px LuckiestGuy"
        })

        this.undernickname = this.add.image(0,this.nickname.y + 70,"profile","undernickname-line").setOrigin(0,0.5)

        this.nick = this.createNick({
            x:this.nickname.x,
            y:this.nickname.y - 60,
            font:"35px LuckiestGuy"
        })

       this.stats_buttons = this.createStatsButtons({
            left_x:100,
            right_x:this.game.GW/2 + 100,
            space_y:150,
            first_row_y: this.profile_guy.y + this.profile_guy.displayHeight + 100
        })

        this.stats_numbers = this.createStatsNumbers({
            left_x:this.stats_buttons.wins.x + this.stats_buttons.wins.displayWidth/2 + 20,
            right_x:this.stats_buttons.deaths.x + this.stats_buttons.deaths.displayWidth/2 + 20,
            font:"50px LuckiestGuy"
        })

      

   //     const busy = 400
     //   const empty = this.game.GH - this.stats_buttons.achievements.y - this.home_button.displayHeight

        this.total =  this.createTotal({
            x:this.game.GW/2,
            y:this.stats_buttons.achievements.y + 170,
            font:"60px LuckiestGuy",
            total_value_font:"90px Arial",
            space:95,
        });


        this.add.image(this.game.GW,this.total.text_value.y - 150,"profile","total-line").setOrigin(1,0.5)
        this.add.image(0,this.total.text_value.y + 60,"profile","total-line").setOrigin(0,0.5).setFlipX(true)
    

        this.status = this.createStatus({
            x:this.game.GW/2,
            y:this.total.text_value.y + 150,
            font:"60px LuckiestGuy",
            status_value_font:"75px Arial",
            space:85,
        })

        this.add.image(this.status.x,this.status.text_value.y,"profile","status-strap").setScale(1,0.9)
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
    createNick(config){
        const {x,y,font} = config;
        return this.add.text(x,y,"NICK",{font}).setOrigin(0.5,0.5)
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
    updateStatsText(){
        const stats = this.getStatsNumbers()

        for(const stat in stats){
            this.stats_numbers[stat].setText(stats[stat]);
        }
        
    }
    updateTotalText(){
        this.total.text_value.setText(this.calculateTotal());
    }

    updateStatusText(){
        this.status.text_value.setText(this.getStatus())
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
    return this.stats.deaths || 0 
}

getHitsNumber(){
    return this.stats.hits || 0
}
getPerfectsNumber(){
    return this.stats.perfects || 0 
}

getAchievementsNumber(){
    return this.stats.achievements || 0
}
calculatePerfectRate(){
    return Number((this.getPerfectsNumber() / this.getHitsNumber()  * 100 ).toFixed(2)) + "%" 
}

createTotal(config){
    const {x,y,font,space,total_value_font} = config
    const total =  this.add.text(x,y,"Total",{font}).setOrigin(0.5);
          total.text_value = this.add.text(x,y+space,this.calculateTotal(),{font:total_value_font}).setOrigin(0.5);

   return total
}
calculateTotal(){
    const scores_to_sum_up = [...progress.levels_scores].filter(n=>n!=-1) // only leave unlocked levels scores

    const levels_score = scores_to_sum_up.reduce((acc,number)=>{return acc+number})
    const perfects_score = this.getPerfectsNumber() / 30 
    const hits_score = this.getHitsNumber() / 50
    const achievements_score = this.getAchievementsNumber()
    const deaths_score = this.getDeathsNumber() / 25

    return Math.floor(levels_score + perfects_score + hits_score + achievements_score + deaths_score) 
}

createStatus(config){
    const {x,y,font,space,status_value_font} = config
    const status = this.add.text(x,y,"Status",{font}).setOrigin(0.5);
          status.text_value = this.add.text(x,y+space,this.getStatus(),{font:status_value_font}).setOrigin(0.5);

   return status
}
getStatus(){
    const total = this.calculateTotal()
    const first_status_total = 30;
    
    let needed_total = first_status_total/1.5;
    let status_index = 0;

    while((total / (needed_total * 1.5)) > 1){
        needed_total *=1.5;
        status_index++;
    }

    return this.ranks[status_index] || this.ranks[this.ranks.length-1] 
}


createHomeButton() {
  return new HomeButton({
       scene:this,
        sprite:"home-button",

        func:async ()=>{
          await this.animateProfileHide()
          this.scene.get("menu").animateShowMenu()
          this.scene.sleep()
        }
     })
  }


  
  setAnimatedObjectsVisibility(visible){
    this.nickname.setAlpha(visible)
    this.profile_guy.setAlpha(visible)
    this.undernickname.setAlpha(visible)

  this.iterateObjectSetAlpha(this.stats_buttons,visible);
  this.iterateObjectSetAlpha(this.stats_numbers,visible);

  this.total.setAlpha(visible)
  this.total.text_value.setAlpha(visible)
  this.status.setAlpha(visible)
  this.status.text_value.setAlpha(visible)
  }

  iterateObjectSetAlpha(object,visible){
    for(const o in object){
        object[o].setAlpha(visible)
    }
  }

  async animateVisibility(duration,visibility){
      this.tweenObjectAlpha(this.nickname,duration,visibility)
      this.tweenObjectAlpha(this.profile_guy,duration,visibility)
      this.tweenObjectAlpha(this.undernickname,duration,visibility)
      this.tweenObjectAlpha(Object.values(this.stats_buttons),duration,visibility)
      this.tweenObjectAlpha(Object.values(this.stats_numbers),duration,visibility)

      this.tweenObjectAlpha(this.total,duration,visibility)
      this.tweenObjectAlpha(this.total.text_value,duration,visibility)

      this.tweenObjectAlpha(this.status,duration,visibility)
      this.tweenObjectAlpha(this.status.text_value,duration,visibility)

      return new Promise(resolve=>{
        this.time.addEvent({callback:resolve(),delay:duration})
      })
      
  }

  tweenObjectAlpha(targets,duration,alpha){
      this.tweens.add({
          targets,
          duration,
          alpha
      })
  }

  async animateProfileShow(){
    this.stats = this.getStats()
    this.updateStatsText()
    this.updateTotalText() // todo 
    this.updateStatusText() // todo

      const duration = 400;

      this.setAnimatedObjectsVisibility(0);
      await this.animateVisibility(duration,1)
      await this.home_button.animateShow();
    
  }

  async animateProfileHide(){
      const duration = 200;

     this.animateVisibility(duration,0)
     await this.home_button.animateHide();
     this.home_button.resetPosition()

  }

  getRanks(){
    return  [
        "NOOB",
        "BEGINNER",
        "LITTLE BOY",
        "AVERAGE",
        "DEXTEROUS",
        "MAGIC FINGER",
        "VETERAN",
        "CRAZY FINGER",
        "TAP EXPERT",
        "TAP KING",  
        "MOTHER FUCK**",
        "SUPER HUMAN",
        "INHUMANLY FAST",
        "INHUMANLY MEGA FAST",
        "CHAMPION",
        "CLICK MASTER",
        "SUPER EXTRA FAST",
        "BOSS",
        "LEGEND",
        "THE GOD",
        "???"   
    ]
}
}

