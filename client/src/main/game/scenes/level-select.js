import * as helper from "../GUI-helper.js"
import playSound from "../../shortcuts/audio-player"
import { getProgress } from "../../shortcuts/save"

export default class levelSelect extends Phaser.Scene {
  constructor() {
    super("levelSelect")
  }

  init(data) {
    this.progress = window.progress//getProgress()
    this.pages_amount = levelsConfiguration.length

    this.current_page_number = this.initPageNumber()

    if (data.page === 0) this.current_page_number = 0 // 0 is false
    this.canChangePage = false

    this.are_thorns_seen = false;
    this.are_spikes_seen = false;
  }

  create() {
    this.black_border = this.createBlackBorder().setVisible(false)

    this.page_glow = this.createPageGlow().setVisible(false)

    this.current_page = this.createPage()

    this.second_page = this.createPage()
    this.second_page.hide()

    this.spikes = this.createSpikes()
  
    this.thorns = this.createThornBorder()

    this.updatePage(this.current_page)
    this.createChangePageButtons()
    this.createHomeButton()

    this.resetPositionsToHidden()
  }
  
  initPageNumber() {
    let index = window.progress.levels_scores.indexOf(-1) -1 
    
    if(index === -2) index = window.progress.levels_scores.length -1
    return  index //getProgress().levels_scores.length - 1 // 0 //  page
  }

  isEasySection(pageNumber = this.current_page_number){
    return levelsConfiguration[pageNumber].info.difficulty === "easy"
    }

isMediumSection(pageNumber = this.current_page_number){
return levelsConfiguration[pageNumber].info.difficulty === "medium"
}

isHardSection(pageNumber = this.current_page_number){
  return levelsConfiguration[pageNumber].info.difficulty === "hard"
  }

  showAllElementsInMenuContext() {
    this.level_select_elements_in_menu_context.forEach((element) =>
      element.setVisible(true).setActive(true)
    )
    return this
  }

  hideAllElementsInMenuContext() {
    this.level_select_elements_in_menu_context.forEach((element) =>
      element.setVisible(false).setActive(false)
    )
  }
  createLevelSelectElementsInMenuContext(scene) {
    this.current_page_number = this.initPageNumber()
    this.level_select_elements_in_menu_context = []

    this.background = helper.createBackground(scene, "colors", "blue_1")
    this.updateBackgroundColor()

    this.level_select_elements_in_menu_context.push(this.background)

    this.level_select_elements_in_menu_context.push(
      helper.createBackground(scene, "levelSelect-bg")
    )

    this.level_select_elements_in_menu_context.push(
      scene.add.image(
        this.game.GW / 2 - 5,
        this.game.GH / 2 - 90,
        "general-2",
        "bubbles-levelselect"
      )
    )

    this.level_select_elements_in_menu_context.push(
      helper.setGameSize(
        scene.add
          .image(this.game.GW / 2, this.game.GH, "general-2", "levelselect-2")
          .setOrigin(0.5, 1),
        true
      )
    )

    this.level_select_elements_in_menu_context.push(
      helper.setGameSize(
        scene.add
          .image(this.game.GW / 2, this.game.GH, "general-2", "levelselect-1")
          .setOrigin(0.5, 1),
        true
      )
    )

    this.hideAllElementsInMenuContext()
  }

  animateLevelSelectHide() {
    const ease = "Sine.easeIn"

    if(this.isMediumSection() || this.isHardSection()){
      this.hideThornBorder()
    }
    if(this.isHardSection()) {
      this.hideSpikes()
    }
    
    this.animateHideChangePageButtons()

    return new Promise((resolve) => {
      this.tweens.add({
        targets: [
          ...this.current_page.getElementsConvertedIntoArray(),
          this.home_button,
        ],
        y: `+=${this.game.GH}`,
        duration: 250,
        ease: ease,
        onComplete: () => {
          this.home_button.resetPosition()
          resolve()
        },
      })
    })
  }

  animateLevelSelectShow() {
    const ease = "Sine.easeOut"

    if(this.isMediumSection() || this.isHardSection()){
      this.showThorns()
    }
    if(this.isHardSection()){
      this.showSpikes()
    }
    
    this.tweens.add({
      targets: this.current_page.getElementsConvertedIntoArray(),
      y: `-=${this.game.GH}`,
      duration: 500,
      ease: ease,
      onComplete: () => {
        this.animateHomeButtonShow(ease)
      },
    })

    this.animateShowChangePageButtons()
  }

  resetPositionsToHidden() {
    // if I  use hide animation when starting level I could not hide
    this.current_page.getElementsConvertedIntoArray().forEach((element) => {
      element.y += this.game.GH
    })
    this.home_button.resetPosition()
  }

  animateHideChangePageButtons() {
    this.tweens.add({
      targets: this.arrows,
      alpha: 0,
      duration: 200,
    })
  }
  animateShowChangePageButtons() {
    this.arrows.forEach((a) => a.setAlpha(0))

    this.tweens.add({
      targets: this.arrows,
      alpha: 1,
      duration: 500,
    })
  }

  createPageGlow() {
    return this.add.image(
      this.game.GW / 2,
      this.game.GH / 2 + 200,
      "general-1",
      "level-select-decoration-hard"
    )
  }

  createBlackBorder() {
    return helper.createBackground(this, "black-border")
  }

  createThornBorder() {
    const ease = "Power1"
    const duration = 300
    const shift = 50

    const thorns_up = this.add
      .image(0, -shift, "general-1", "thorns_up")
      .setOrigin(0, 0)
      .setFlipY(true)
      .setFlipX(true)
    

      thorns_up.animate = (showOrHide) => {
        

        let value = shift
        if(showOrHide === "hide"){
          value = -value;
        }
        
      this.tweens.add({
          targets:thorns_up,
          duration,
          y:`+=${value}`,
          ease
        })
      }

    helper.setGameSize(thorns_up, true)

    const thorns_down = this.add
      .image(0, this.game.GH + shift, "general-1", "thorns_up")
      .setOrigin(0, 1)

      thorns_down.animate = (showOrHide) => {
        let value = shift
        if(showOrHide === "hide"){
          value = -value;
        }
       
        this.tweens.add({
          targets:thorns_down,
          duration,
          y:`-=${value}`,
          ease
        })
      }

    helper.setGameSize(thorns_down, true)

    const thorns_left = this.add
      .image(-shift, 0, "general-1", "thorns_sides")
      .setOrigin(0, 0)
      .setFlipY(true)

      thorns_left.animate = (showOrHide) => {
        let value = shift
        if(showOrHide === "hide"){
          value = -value;
        }
        

        this.tweens.add({
          targets:thorns_left,
          duration,
          x:`+=${value}`,
          ease
        })
      }

    helper.setGameSize(thorns_left, false, true)

    const thorns_right = this.add
      .image(this.game.GW+shift, 0, "general-1", "thorns_sides")
      .setOrigin(1, 0)
      .setFlipX(true)

      thorns_right.animate = (showOrHide) => {
        let value = shift
        if(showOrHide === "hide"){
          value = -value;
         
        }
        
        
        this.tweens.add({
          targets:thorns_right,
          duration,
          x:`-=${value}`,
          ease
 
        })
      }


    helper.setGameSize(thorns_right, false, true)

    return [thorns_up, thorns_left, thorns_right, thorns_down]
  }

createSpikes(){
  const ease = "Power1"
  const duration = 300
  const shift = 100

  const spikes_up = this.add
    .image(0, -shift, "spikes-up")
    .setOrigin(0, 0)
 

    spikes_up.animate = (showOrHide) => {
      

      let value = shift
      if(showOrHide === "hide"){
        value = -value;
      }
      
    this.tweens.add({
        targets:spikes_up,
        duration,
        y:`+=${value}`,
        ease
      })
    }

  helper.setGameSize(spikes_up, true)

  const spikes_down = this.add
    .image(0, this.game.GH + shift,"spikes-down")
    .setOrigin(0, 1)

    spikes_down.animate = (showOrHide) => {
      let value = shift
      if(showOrHide === "hide"){
        value = -value;
      }
     
      this.tweens.add({
        targets:spikes_down,
        duration,
        y:`-=${value}`,
        ease
      })
    }

  helper.setGameSize(spikes_down, true)

  const spikes_left = this.add
    .image(-shift, 0,"spikes-left")
    .setOrigin(0, 0)
  

    spikes_left.animate = (showOrHide) => {
      let value = shift
      if(showOrHide === "hide"){
        value = -value;
      }
      

      this.tweens.add({
        targets:spikes_left,
        duration,
        x:`+=${value}`,
        ease
      })
    }

  helper.setGameSize(spikes_left, false, true)

  const spikes_right = this.add
    .image(this.game.GW+shift, 0, "spikes-right")
    .setOrigin(1, 0)


    spikes_right.animate = (showOrHide) => {
      let value = shift
      if(showOrHide === "hide"){
        value = -value;
       
      }
      
      
      this.tweens.add({
        targets:spikes_right,
        duration,
        x:`-=${value}`,
        ease

      })
    }


  helper.setGameSize(spikes_right, false, true)

  return [spikes_up, spikes_left, spikes_right, spikes_down]
}


showSpikes(sign) {
  if(this.are_spikes_seen) return

   const condition_1 = 
   this.isHardSection() && this.isMediumSection(this.current_page_number-1) && sign === "-"

const condition_2 = this.current_page_number === levelsConfiguration.length -1 && sign === "+"

if(condition_1 || condition_2 || !sign){
 this.are_spikes_seen = true;
 this.spikes.forEach((spike) => { 
   spike.animate("show")
 })
}

 }
 hideSpikes(sign) {
  if(!this.are_spikes_seen) return

  const condition_1 = 
  this.isMediumSection() &&this.isHardSection(this.current_page_number+1)  && sign === "+"


const condition_2 = this.current_page_number === 0 && sign === "-"

if(condition_1 || condition_2 || !sign){
this.are_spikes_seen = false;
this.spikes.forEach((spike) => {
  spike.animate("hide")
})
}
}



  hideThornBorder(sign) {
    if(!this.are_thorns_seen) return
    const condition_1 = 
    this.isEasySection() &&this.isMediumSection(this.current_page_number+1)  && sign === "+"


const condition_2 = this.current_page_number === 0 && sign === "-"

if(condition_1 || condition_2 || !sign){
  this.are_thorns_seen = false;
  this.thorns.forEach((thorn) => {
    thorn.animate("hide")
  })
}
  }


   showThorns(sign) {
   if(this.are_thorns_seen) return

    const condition_1 = 
    this.isMediumSection() && this.isEasySection(this.current_page_number-1) && sign === "-"

const condition_2 = this.current_page_number === levelsConfiguration.length -1 && sign === "+"

if(condition_1 || condition_2 || !sign){
  this.are_thorns_seen = true;
  this.thorns.forEach((thorn) => { 
    thorn.animate("show")
  })
}

  }

  createLevelLock(x, y) {
    return {
      lock: this.add.image(x, y, "general-1", "level-locked").setOrigin(0.5, 0),
    }
  }

  createPageElementsBackground() {
    const page = this.add
      .image(this.game.GW / 2, this.game.GH / 2, "levelSelect-middle")
      .setInteractive()
      .on("pointerup", this.pageClickCallback, this)
    return page
  }
  createPageRequirements(x, y) {
    let score = this.progress.levels_scores[this.current_page_number]
    if (score == null) score = 0

    const elements = {}

    elements.score_bar = this.add.image(
      x,
      y + 130,
      "general-1",
      "level-select-score-bar"
    )

    elements.divider = this.add
      .text(x + 45, elements.score_bar.y +15, "/", {
        font: "50px LuckiestGuy", /// DIVIDER
      })
      .setOrigin(0.5)

    elements.current_score = this.add
      .text(
        elements.divider.x - 13,
        elements.divider.y - 30, /// CURRENT SCORE
        score,
        {
          font: "145px LuckiestGuy",
        }
      )
      .setOrigin(1, 0.5)

    elements.current_score.update = (page_number) => {
      let score = this.progress.levels_scores[page_number]
      if (score == null) score = 0

      elements.current_score.setText(score)
    }
    elements.score_to_reach = this.add
      .text(
        elements.divider.x + 17 ,
        elements.divider.y ,
        levelsConfiguration[this.current_page_number].info.score_to_next_level, /// NEEDED SCORE
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0, 0.5)

    elements.score_to_reach.update = function (page_number) {
      this.setText(levelsConfiguration[page_number].info.score_to_next_level)
    }

    return elements
  }

  createPageIcon(x, y) {
    const icon =
      levelsConfiguration[this.current_page_number].info.name + "_icon"
    const image = this.add.image(x, y - 130, "levels-icons", icon).setDepth(1)
    image.update = function (page_number) {
      this.setFrame(levelsConfiguration[page_number].info.name + "_icon")
    }
    return { icon: image }
  }

  createPageInfo(x, y, displayHeight) {
    const elements = {}

    const { difficulty, name } = levelsConfiguration[
      this.current_page_number
    ].info



    elements.difficulty = this.add
      .text(x, y - displayHeight / 2 + 260, difficulty, {
        font: "50px LuckiestGuy",
      })
      .setOrigin(0.5)
      .setDepth(0.1)
    elements.difficulty.update = function (page_number) {
      this.setText(levelsConfiguration[page_number].info.difficulty.toUpperCase())
    }

    elements.name = this.add
      .text(x, y - displayHeight / 2 + 110, name, {
        font: "60px LuckiestGuy",
      })
      .setOrigin(0.5)
      .setDepth(0.1)

    elements.name.update = function (page_number) {
      this.setText(levelsConfiguration[page_number].info.name.toUpperCase())
    }

    elements.difficulty_bar = this.add
      .image(
        elements.difficulty.x,
        elements.difficulty.y,
        "general-1",
        "level-select-difficulty-bar"
      )
      .setDepth(0.09)

    elements.name_bar = this.add
      .image(
        elements.name.x,
        elements.name.y,
        "general-1",
        "level-select-name-bar"
      )
      .setScale(1.1,1)
      .setDepth(0.09)

    return elements
  }

  createPageRanking(x, y) {
    const button = helper.createButton(
      this,
      x,
      y + 400,
      "ranking-icon",
      () => {
        this.scene.sleep()
        this.scene.launch("leaderboard", {
          level: this.current_page_number + 1,
          launcher: this.scene,
        })
      },
      "button"
    )
    this.page_glow.y = button.y
    return {
      ranking_button: button,
    }
  }

  isLevelUnlocked() {
   
    return window.progress.levels_scores[this.current_page_number] != -1 // this.progress.levels_scores.length >= this.current_page_number + 1
  }
  tweenPage(sign) {
    
    const ease = "Power1"
    const duration = 300

    if (!this.canChangePage) return
    playSound(this, "change_object")
    this.canChangePage = false

    let second_page_shift = this.game.GW

    if (sign === "+") {
      second_page_shift = -second_page_shift
      //going left
      this.current_page_number--
      if (this.current_page_number == -1)
        this.current_page_number = this.pages_amount - 1
    } else {
      //  second_page_shift = this.game.GW
      //going right
      this.current_page_number++
      if (this.current_page_number == this.pages_amount)
        this.current_page_number = 0
    }

    const pages_elements_to_tween = [
      ...this.current_page.getElementsConvertedIntoArray(),
      ...this.second_page.getElementsConvertedIntoArray(),
    ]

    this.second_page
      .getElementsConvertedIntoArray()
      .forEach((e) => (e.x += second_page_shift))

    this.second_page.show()

    this.updatePage(this.second_page,sign)

    this.tweens.add({
      targets: pages_elements_to_tween,
      x: `${sign}=${Math.abs(second_page_shift)}`,
      duration: duration,
      ease: ease,
      onStart: () => {
        this.updateBackgroundColor()
      },
      onComplete: () => {
        this.current_page.hide()

        this.current_page
          .getElementsConvertedIntoArray()
          .forEach((e) => (e.x += second_page_shift))

        const past_current_page = this.current_page
        this.current_page = this.second_page
        this.second_page = past_current_page

        this.canChangePage = true
      },
    })
  }

  createPage() {
    const page = this.createPageElementsBackground()
    const { x, y, displayHeight } = page

    page.elements = {
      ...this.createPageInfo(x, y, displayHeight),
      ...this.createPageRequirements(x, y, displayHeight),
      ...this.createPageRanking(x, y, displayHeight),
      ...this.createPageIcon(x, y, displayHeight),
      ...this.createLevelLock(x, y, displayHeight),
    }

    page.show = function () {
      this.setVisible(true)
      for (const element in this.elements) {
        this.elements[element].setVisible(true)
      }
    }

    page.hide = function () {
      this.setVisible(false)
      for (const element in this.elements) {
        this.elements[element].setVisible(false)
      }
    }

    page.getElementsConvertedIntoArray = function () {
      const array = [this]

      for (const element in this.elements) {
        array.push(this.elements[element])
      }

      return array
    }

    return page
  }

  updateVisiblePage() {
    this.progress.levels_scores = window.progress.levels_scores //getProgress().levels_scores
    this.updatePage(this.current_page)
  }

  updatePage(page,sign) {
    const { elements } = page
    for (const element in elements) {
      if (typeof elements[element].update === "function") {
        elements[element].update(this.current_page_number)
      }
    }

    if (this.isLevelUnlocked()) {
      ;[
        elements.score_bar,
        elements.divider,
        elements.current_score,
        elements.score_to_reach,
        elements.ranking_button,
      ].forEach((e) => e.setVisible(true))

      elements.lock.setVisible(false)
    } else {
      ;[
        elements.score_bar,
        elements.divider,
        elements.current_score,
        elements.score_to_reach,
        elements.ranking_button,
      ].forEach((e) => e.setVisible(false))

      elements.lock.setVisible(true)
    }

    const difficulty =
      levelsConfiguration[this.current_page_number].info.difficulty

    if (difficulty === "hard" || difficulty === "medium") {
      this.showThorns(sign)
      this.black_border.setVisible(true)

      difficulty === "hard"
        ? this.showHardLevelsOrnaments(elements,sign)
        : this.hideHardLevelsOrnaments(elements)
    } else {
      this.black_border.setVisible(false)
      this.hideHardLevelsOrnaments(elements,sign)
      this.hideThornBorder(sign)
    }
  }

  showHardLevelsOrnaments({ score_bar, name_bar },sign) {

    this.showSpikes(sign)
  
    score_bar.setFrame("level-select-score-bar-hard")
    name_bar.setFrame("level-select-name-bar-hard")

    this.page_glow.setVisible(true)
  }

  hideHardLevelsOrnaments({ score_bar, name_bar },sign) {
   
    this.hideSpikes(sign)
    score_bar.setFrame("level-select-score-bar")
    name_bar.setFrame("level-select-name-bar")

    this.page_glow.setVisible(false)
    // this.black_border.setVisible(false)
  }

  updateBackgroundColor() {
    const bg_color =
      levelsConfiguration[this.current_page_number].color || "blue_1"
    this.background.setFrame(bg_color)
  }

  pageClickCallback() {
    if (
      !this.canChangePage ||
      !this.isLevelUnlocked()
     
    )
      return
      this.game.audio.music.menu_theme.stop()
    this.game.audio.sounds.start_sound.play()
    this.canChangePage = false

    const level_object = levelsConfiguration[this.current_page_number]
    const { name, difficulty } = level_object.info
    const level_to_start = `${name.capitalize()}_${difficulty.capitalize()}`

    this.scene.launch(level_to_start, {
      config: level_object.config,
      level: this.current_page_number + 1,
      score_to_next_level: level_object.info.score_to_next_level,
    })

    const started_scene = this.scene.get(level_to_start)
    started_scene.is_first_try = true
    started_scene.scene
      .launch("lose", { scene: started_scene })
      .bringToTop("lose")
      .sleep("lose")

    this.scene.sleep("menu")
    this.scene.sleep()

    this.resetPositionsToHidden()
  }

  createChangePageButtons() {
    let shift = 275
    this.arrows = []

    this.arrows[0] = helper
      .createButton(
        this,
        this.game.GW / 2 - shift,
        this.game.GH / 2,
        "arrow-button",
        () => this.tweenPage("+")
      )
      .setAlpha(0)

    this.arrows[1] = helper
      .createButton(
        this,
        this.game.GW / 2 + shift,
        this.game.GH / 2,
        "arrow-button",
        () => {
          this.tweenPage("-")
        }
      )
      .setFlipX(true)
      .setAlpha(0)
  }

  createHomeButton() {
    this.home_button = helper
      .createButton(
        this,
        this.game.GW / 2,
        this.game.GH,
        "home-button",
        async () => {
          this.canChangePage = false
          this.hideThornBorder()
          await this.animateLevelSelectHide()

          this.hideAllElementsInMenuContext()

          this.scene.get("menu").showElementsSharedWithLevelSelect()
          this.scene.get("menu").resetPositionsToHidden().animateShowMenu()
          this.scene.sleep()
        },
        "button"
      )
      .setOrigin(0.5, 1)

    this.home_button.y += this.home_button.displayHeight
    const hidden_y = this.home_button.y
    this.home_button.resetPosition = function () {
      this.y = hidden_y
    }
  }

  animateHomeButtonShow(ease) {
    this.tweens.add({
      targets: this.home_button,
      y: this.game.GH - 15,
      duration: 200,
      ease: ease,
      onComplete: () => {
        this.canChangePage = true
      },
    })
  }
  animateHomeButtonHide(ease) {
    this.tweens.add({
      targets: this.home_button,
      y: this.game.GH - 15,
      duration: 200,
      ease: ease,
    })
  }
}
