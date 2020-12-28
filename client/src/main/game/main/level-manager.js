import LevelHelper from "./level-helper.js"
import * as helper from "../GUI-helper.js"
import Utils from "../../utils"
import { POST_LEVEL_SCORE, SAVE_MONEY } from "../../shortcuts/requests"
import { getProgress, saveProgress } from "../../shortcuts/save"
import PerfectManager from "./perfect-manager"
import playAudio from "../../shortcuts/audio-player"
import LevelFunctionsCaller from "./level-functions-caller"
import checkConnection from "../../network-status"
import {ADS_COUNT_SHOW} from "../../../config"

export default class Manager {
  constructor(scene, config) {
    this.scene = scene
    this.progress = window.progress// getProgress()
    this.config = config
  }

  init() {
    this.GUI_helper = helper

    this.GW = this.scene.game.GW
    this.GH = this.scene.game.GH
    this.target_array = []
    this.circles = []
    this.circle_distance_to_circle = null
    this.current_circle = 1
    this.rotation_angle = 270
    this.rotation_direction = 1
    this.angle_between = 360 / this.config.targets_amount
    this.game_started = false
    this.is_possible_miss = false
    this.current_target = this.config.starting_target
    this.rotation_speed = this.config.rotation_speed
    this.intro_duration = 700

    this.perfect_combo = 0
    this.score = 0
    this.perfect = 0

    this.target_texture = "target_" + this.progress.current_skins["targets"]
    this.target_to_catch_texture =
      "targetToCatch_" + this.progress.current_skins["targets"]
  }

  create() {

if(window.admob) admob.banner.hide()


    this.scene.cameras.main.setBackgroundColor(
      this.config.canvas_color || 0x000000
    )
    this.scene.scene.launch("UI", { context: this })
    this.attachSceneListeners()

    this.levelFunctionsCaller = new LevelFunctionsCaller(this.scene)
    this.perfectManager = new PerfectManager(this)
    this.perfectManager.createPerfectText()

    this.helper = new LevelHelper(this)
    this.helper.randomNextTarget()

    this.scene.is_first_try && this.createTappingAnimation()
    /*
    this.fps_text = this.scene.add
      .text(150, 150, this.scene.game.loop.actualFps, {
        font: "70px LuckiestGuy",
      })
      .setDepth(100)
      */
  }
  createTappingAnimation() {
    this.scene.is_first_try = false
    this.scene.anims.create({
      key: "tap",
      frames: this.scene.anims.generateFrameNumbers("fingers", {
        start: 0,
        end: 1,
      }),
      repeat: -1,
      frameRate: 2,
      yoyo: true,
    })

    this.finger = this.scene.add
      .sprite(this.GW / 2, this.GH - 150, "fingers", 0)
      .setDepth(1).setScale(0.7)
      .play("tap")
  }
  showNewLevelUnlockedAlert() {
    const lock = this.scene.add.sprite(
      this.GW / 2,
      0,
      "general-1",
      "locked"
    )

    this.scene.tweens.add({
      targets: lock,
      y: "+=150",
      duration: 1000,
      ease:"Power1",
      onComplete: () => {
        lock.setFrame("unlocked")
        this.scene.tweens.add({
          targets: lock,
          alpha: 0,
          duration: 1400,
        })
      },
    })
  }
  checkIfMissedTarget() {
    const distance_from_target = this.helper.calculateRotatingCircleDistanceToTarget()

    if (!this.hasHitTarget(distance_from_target) && this.is_possible_miss) {
      this.gameOver()
    }

    if (distance_from_target < 10) {
      this.is_possible_miss = true
    }
  }

  hasHitTarget(distanceToTarget) {
    return distanceToTarget < 85 * this.target_array[0].scale
  }
  playSound(sound) {
    playAudio(this.scene, sound)
  }
  changeBall() {
    this.levelFunctionsCaller.tryChangeRotationSpeed()

    this.rotation_speed += this.config.acceleration

    const distance_from_target = this.helper.calculateRotatingCircleDistanceToTarget()

    if (this.hasHitTarget(distance_from_target)) {
      this.levelFunctionsCaller.tryShake()

      if (distance_from_target < 5) {
        this.score += 2
        this.perfect++
        this.perfect_combo++
        this.perfectManager.showPerfectText()
        this.perfectManager.showPerfectEffect()
        this.perfect_combo >= 3
          ? this.playSound("perfect_2")
          : this.playSound("perfect_1")
      } else {
        this.score++
        this.perfect_combo = 0
      }
      this.playSound("tap")
      if (
        this.isNewLevelNeededScoreReached() &&
        !this.level_unlock_alert_shown
      ) {
        this.level_unlock_alert_shown = true
        this.showNewLevelUnlockedAlert()
        this.playSound("new_level_sound")
       
      }
      this.UI.updateScoreText()
      // this.perfectManager.updateScoreText()

      this.is_possible_miss = false

      this.levelFunctionsCaller.tryCalculateCirclesPosition()
      this.current_target = this.next_target
      this.target_array[this.current_target].setFrame(this.target_texture)

      this.helper.randomNextTarget()

      this.levelFunctionsCaller.trySwapFunctionsToTheNearset()

      this.helper.checkNewTargetsQueue()

      this.levelFunctionsCaller.tryHandleFakeTargetToCatch()

      this.levelFunctionsCaller.tryHandleFakeTargetsToCatch()

      this.setNewTarget()

      this.levelFunctionsCaller.tryRemoveCorrectTargetTextureToCatch()

      this.levelFunctionsCaller.tryRemoveTargetToCatchSkin()

      this.current_circle = 1 - this.current_circle

      this.rotation_angle = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.BetweenPoints(
          this.circles[1 - this.current_circle],
          this.circles[this.current_circle]
        )
      )

      this.levelFunctionsCaller.tryTeleportCircle()

      this.levelFunctionsCaller.trySlideCircle()

      this.helper.extendStick()

      this.levelFunctionsCaller.tryDarkenTargets()

      this.levelFunctionsCaller.tryHideSetForAWhile()

      this.levelFunctionsCaller.tryHideTargets()
    } else {
      this.gameOver()
    }
  }
  createGUI() {
    helper.createBackground(this.scene, this.config.background)
  }

  createFirstTarget() {
    this.target_array.push(
      this.scene.add
        .image(0, this.GH / 2,"targets", this.target_texture)
        .setAlpha(0)
        .setDepth(0.1)
    )
  }
  createTargets() {
    for (let i = 0; i < this.config.targets_amount - 1; i++) {
      this.addTarget().setAlpha(0).setDepth(0.1)
    }
  }
  setNewTarget() {
    this.target_array[this.next_target].setFrame(this.target_to_catch_texture)
  }
  showTargets() {
    this.scene.tweens.add({
      targets: this.target_array,
      duration: 400,
      alpha: 1,
    })
  }
  createStick() {
    this.stick = this.scene.add
      .sprite(
        this.target_array[this.config.starting_target].x,
        this.target_array[this.config.starting_target].y,
        "sticks",
        "stick_" + this.progress.current_skins["sticks"]
      )
      .setOrigin(0, 0.5)
      .setAngle(this.rotation_angle)
      .setDepth(0.1)
  }
  createCircles() {
    this.circles[0] = this.scene.add
      .sprite(
        this.stick.x,
        this.stick.y,
        "circles",
        "circle_" + this.progress.current_skins["circles"]
      )
      .setDepth(0.1)

    this.helper.extendStick()

    this.circles[this.current_circle] = this.scene.add
      .sprite(
        this.stick.x,
        this.stick.y - this.stick.displayWidth,
        "circles",
        "circle_" + this.progress.current_skins["circles"]
      )
      .setDepth(0.1)

    this.updateCircleStickAngle() /// move this function to create function in every level
  }
  bindInputEvents() {
    this.scene.input.on("pointerdown", ({ x, y }) => {
      // this.fps_text.setText(this.scene.game.loop.actualFps)

      if (Phaser.Geom.Rectangle.Contains(this.UI.getPauseButtonBounds(), x, y))
        return
      if (!this.game_started) {
        if (this.finger) this.finger.destroy()
        this.game_started = true

        this.levelFunctionsCaller.tryBlindTheScreen()
      } else this.changeBall()
    })

    this.perfectManager.createPerfectEmitter() // it should be in each level at the end of create function
  }

  updateRotationAngle() {
    this.rotation_angle =
      (this.rotation_angle +
        this.rotation_speed * (2 - 1) * this.rotation_direction) %
      360
  }
  updateCircleStickAngle() {
    ///circles
    //console.log(this.stick.displayWidth)
    const static_distance =
      (this.circle_distance_to_circle || this.stick.displayWidth) +
      this.circles[1 - this.current_circle].displayWidth

    const radians_angle = Phaser.Math.DegToRad(this.rotation_angle - 90)

    const current_circle_x =
      this.circles[1 - this.current_circle].x -
      static_distance * Math.sin(radians_angle)

    const current_circle_y =
      this.circles[1 - this.current_circle].y +
      static_distance * Math.cos(radians_angle)

    this.circles[this.current_circle].setPosition(
      current_circle_x,
      current_circle_y
    )

    /// stick
    this.stick.setAngle(this.rotation_angle)
    this.helper.centerStick()
  }

  addTarget() {
    const startX = this.target_array[this.target_array.length - 1].x
    const startY = this.target_array[this.target_array.length - 1].y

    const radians_angle = Phaser.Math.DegToRad(
      this.config.additional_angle +
        this.angle_between * this.target_array.length
    )

    const targetX = startX + this.config.ball_distance * Math.sin(radians_angle)
    const targetY = startY + this.config.ball_distance * Math.cos(radians_angle)

    const target = this.scene.add.image(
      targetX,
      targetY,
      "targets",
      "target_" + this.progress.current_skins["targets"]
    )

    this.target_array.push(target)
    return target
  }

  centerTargets() {
    const { x, y, minX, minY } = this.helper.calculateMinMaxTargetsPos()

    const differenceX = x - minX
    const newX = (this.GW - differenceX) / 2
    const target_shiftX = newX - minX

    const differenceY = y - minY
    const newY = (this.GH - differenceY) / 2
    const target_shiftY = newY - minY // + this.top_bar.displayHeight / 2

    this.target_array.forEach((target) => {
      target.x += target_shiftX
      target.y += target_shiftY
    })
  }

  attachSceneListeners() {
    this.UI = this.scene.scene.get("UI")
    this.scene.scene.bringToTop("UI")

    this.scene.events.on("pause", () => {
      this.scene.scene.sleep("UI")
    })

    this.scene.events.on("resume", () => {
      this.scene.scene.wake("UI")
    })

    this.scene.events.on("shutdown", () => this.scene.scene.stop("UI"))
  }
  isNewLevelNeededScoreReached() {
    
    return (
     window.progress.levels_scores[this.scene.level] === -1 &&
      this.score >= this.scene.score_to_next_level
    )
  }

  gameOver() {
   

    this.scene.tweens.add({
      targets: [...this.circles, this.stick],
      duration: 400,
      alpha: 0.1,
    })

    this.UI.scene.stop()
    this.playSound("die")

    const lose_scene = this.scene.scene.get("lose")

    this.scene.input.removeAllListeners()
    this.game_started = false

    this.progress.money += this.score // earned money

    let is_any_update = false

    if (this.isNewLevelNeededScoreReached()) {
      is_any_update = true
      this.progress.levels_scores[this.scene.level] = 0
   
      POST_LEVEL_SCORE({

        score: 0,
        nickname: my_nickname,
        level: Utils.convertLevelNumberToLevelName(levelsConfiguration[this.scene.level]),
      }).catch(()=>checkConnection(this.scene))
   
      lose_scene.showNextLevelButton()
      lose_scene.hideRestartButton()
    } else {
      lose_scene.showRestartButton()
      lose_scene.hideNextLevelButton()
    }

    this.scene.scene.wake("lose")
    lose_scene.unactivateButtons()
    lose_scene.animateShow()
  
 

    const this_level_score = this.progress.levels_scores[this.scene.level - 1]
    if (this.score > this_level_score || !this_level_score) {
      is_any_update = true
      /// -1, array is counted from 0
      this.progress.levels_scores[this.scene.level - 1] = this.score /// -1, array is counted from 0


      POST_LEVEL_SCORE({
        score: this.score,
        nickname: my_nickname,
        level: Utils.convertLevelNumberToLevelName(levelsConfiguration[this.scene.level-1]),
      }).catch(()=>checkConnection(this.scene))
   

    }
    lose_scene.updatePoints(
      this.score,
      this.perfect,
      this.progress.levels_scores[this.scene.level - 1]
    )

    window.progress = this.progress // saveProgress(this.progress)
    
if(this.score > 0){
   SAVE_MONEY({ money: this.progress.money, nickname: my_nickname }).catch(()=>checkConnection(this.scene))
}
   

    is_any_update && this.scene.scene.get("levelSelect").updateVisiblePage()

    this.scene.tweens.add({
      targets: helper
        .createBackground(this.scene, "black-bg")
        .setAlpha(0)
        .setDepth(2),
      duration: 400,
      alpha: 1,
    })

    if(window.admob){
      admob.banner.show()

      window.ADS_COUNT ++;
      if(window.ADS_COUNT >= ADS_COUNT_SHOW ){
        window.ADS_COUNT = 0
        admob.interstitial.show()
        admob.interstitial.prepare()
      }

   
  }
  }
}
