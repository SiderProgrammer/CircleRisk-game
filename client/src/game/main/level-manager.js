import LevelHelper from "./level-helper.js"
import * as helper from "../helper.js"

import { POST_LEVEL_SCORE, SAVE_MONEY } from "../../shortcuts/requests"
import { getProgress, saveProgress } from "../../shortcuts/save"
import PerfectManager from "./perfect-manager"
import LoseMenu from "./lose-menu"

export default class Manager {
  constructor(scene, config) {
    this.scene = scene
    this.progress = getProgress()
    this.config = config
  }

  init() {
    this.GUI_helper = helper

    this.GW = this.scene.game.GW
    this.GH = this.scene.game.GH
    this.target_array = []
    this.circles = []
    this.current_circle = 1
    this.rotation_angle = 270
    this.rotation_direction = 1
    this.angle_between = 360 / this.config.targets_amount
    this.game_started = false
    this.is_possible_miss = false
    this.current_target = this.config.starting_target
    this.rotation_speed = this.config.rotation_speed
    this.score = 0
    this.perfect = 0

    this.target_texture = "target_" + this.progress.current_skins["targets"]
    this.target_to_catch_texture = "targetToCatch_1" // + this.progress.current_skins["targets"]
  }

  create() {
    this.loseMenuManager = new LoseMenu(this)
    this.loseMenuManager.createLoseMenu()
    this.loseMenuManager.hideMenu()

    this.perfectManager = new PerfectManager(this)
    this.perfectManager.createPerfectText()
    this.perfectManager.createScoreText()

    this.helper = new LevelHelper(this)
    this.helper.randomNextTarget()

    this.stars = this.scene.add.particles("star").setDepth(1)
  }

  checkIfMissedTarget() {
    const distance_from_target = Phaser.Math.Distance.BetweenPoints(
      this.circles[this.current_circle],
      this.target_array[this.next_target]
    )

    if (distance_from_target > 90 && this.is_possible_miss) {
      // this.gameOver();
    }

    if (distance_from_target < 10) {
      this.is_possible_miss = true
    }
  }

  changeBall() {
    if (typeof this.scene.shake === "function") {
      ///
      this.scene.shake()
    }
    this.rotation_speed += this.config.acceleration

    const distance_from_target = Phaser.Math.Distance.BetweenPoints(
      this.circles[this.current_circle],
      this.target_array[this.next_target]
    )

    if (distance_from_target < 90) {
      if (distance_from_target < 10) {
        this.score += 2
        this.perfect++
        this.perfectManager.showPerfectText()
        this.perfectManager.showPerfectEffect()
      } else {
        this.score++
      }

      this.perfectManager.updateScoreText()
      this.is_possible_miss = false

      if (typeof this.scene.calculateCirclesPosition === "function") {
        ////
        this.scene.calculateCirclesPosition()
      }

      this.current_target = this.next_target
      this.target_array[this.current_target].setTexture(this.target_texture)

      this.helper.randomNextTarget()
      this.helper.checkNewTargetsQueue()

      if (typeof this.scene.handleFakeTargetToCatch === "function") {
        this.scene.handleFakeTargetToCatch() // one fake target
      }

      if (typeof this.scene.handleFakeTargetsToCatch === "function") {
        this.scene.handleFakeTargetsToCatch() // many fake targets
      }

      this.setNewTarget()

      if (typeof this.scene.removeCorrectTargetTextureToCatch === "function") {
        this.scene.removeCorrectTargetTextureToCatch() // many fake targets
      }

      if (typeof this.scene.removeTargetToCatchSkin === "function") {
        this.scene.removeTargetToCatchSkin() ///
      }

      this.current_circle = 1 - this.current_circle

      this.rotation_angle = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.BetweenPoints(
          this.circles[1 - this.current_circle],
          this.circles[this.current_circle]
        )
      )

      if (typeof this.scene.slideCircle === "function") {
        ////
        this.scene.slideCircle()
      }

      this.helper.extendStick()

      if (typeof this.scene.darkenTargets === "function") {
        ////
        this.scene.darkenTargets()
      }
    } else {
      this.gameOver()
    }
  }
  createGUI() {
    helper.createBackground(this.scene, this.config.background)
    this.top_bar = helper
      .createTopBar(this.scene, "top-bar")
      .setTint(this.config.bar_tint) //.setDepth(1);

    helper
      .createButton(this.scene, 10, 10, "home-button", () =>
        this.scene.scene.start("menu")
      )
      // .setDepth(1)
      .setOrigin(0)
  }

  createFirstTarget() {
    this.target_array.push(
      this.scene.add.image(0, this.GH / 2, this.target_texture).setAlpha(0)
    )
  }
  createTargets() {
    for (let i = 0; i < this.config.targets_amount - 1; i++) {
      this.addTarget().setAlpha(0)
    }
  }
  setNewTarget() {
    this.target_array[this.next_target].setTexture(this.target_to_catch_texture)
  }
  showTargets() {
    this.scene.tweens.add({
      targets: this.target_array,
      duration: 300,
      alpha: 1,
    })
  }
  createStick() {
    this.stick = this.scene.add
      .sprite(
        this.target_array[this.config.starting_target].x,
        this.target_array[this.config.starting_target].y,
        "stick_" + this.progress.current_skins["sticks"]
      )
      .setOrigin(0, 0.5)
      .setAngle(this.rotation_angle)
  }
  createCircles() {
    this.circles[0] = this.scene.add.sprite(
      this.stick.x,
      this.stick.y,
      "circle_" + this.progress.current_skins["circles"]
    )

    this.helper.extendStick()

    this.circles[this.current_circle] = this.scene.add.sprite(
      this.stick.x,
      this.stick.y - this.stick.displayWidth,
      "circle_" + this.progress.current_skins["circles"]
    )

    this.updateCircleStickAngle() /// move this function to create function in every level
  }
  bindInputEvents() {
    this.scene.input.on("pointerdown", () => {
      this.scene.add.text(150, 150, this.scene.game.loop.actualFps)
      if (!this.game_started) {
        this.game_started = true
      } else {
        this.changeBall()
      }
    })
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
      this.stick.displayWidth +
      this.circles[1 - this.current_circle].displayWidth

    const radians_angle = Phaser.Math.DegToRad(this.rotation_angle - 90)
    if (this.stick.displayWidth < 0) this.stick.displayWidth = 0

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
      "target_" + this.progress.current_skins["targets"]
    )

    this.target_array.push(target)
    return target
  }

  centerTargets() {
    const pos = this.helper.calculateMinMaxTargetsPos()

    const differenceX = pos.x - pos.minX
    const newX = (this.GW - differenceX) / 2
    const target_shiftX = newX - pos.minX

    const differenceY = pos.y - pos.minY
    const newY = (this.GH - differenceY) / 2
    const target_shiftY = newY - pos.minY + this.top_bar.displayHeight / 2

    this.target_array.forEach((target) => {
      target.x += target_shiftX
      target.y += target_shiftY
    })
  }

  gameOver() {
    this.loseMenuManager.update()
    this.loseMenuManager.showMenu()
    

    this.scene.input.removeAllListeners()
    this.game_started = false

    const earned_money = this.score
    this.progress.money += earned_money

    if (
      !this.progress.levels_scores[this.scene.level] &&
      this.score >= this.scene.score_to_next_level
    ) {
      this.progress.levels_scores[this.scene.level] = 0
      console.log("new level unlocked")
    }

    const this_level_score = this.progress.levels_scores[this.scene.level - 1]
    if (this.score > this_level_score || !this_level_score) {
      /// -1, array is counted from 0
      this.progress.levels_scores[this.scene.level - 1] = this.score /// -1, array is counted from 0

      POST_LEVEL_SCORE({
        score: this.score,
        nickname: this.progress.nickname,
        level: this.scene.level - 1,
      })
    }

    saveProgress(this.progress)

    SAVE_MONEY({ money: this.progress.money, nickname: this.progress.nickname })

    const bg = helper.createBackground(this.scene, "black-bg").setAlpha(0)

    this.scene.tweens.add({
      targets: bg,
      duration: 400,
      alpha: 1,
    })
  }
}
