import LevelHelper from "./level-helper.js"
import * as helper from "../GUI-helper.js"
import Utils from "../../utils"
import { POST_LEVEL_SCORE, SAVE_MONEY } from "../../shortcuts/requests"
import { getProgress, saveProgress } from "../../shortcuts/save"
import PerfectManager from "./perfect-manager"
import playAudio from "../../shortcuts/audio-player"
import LevelFunctionsCaller from "./level-functions-caller"
import checkConnection from "../../network-status"
import { ADS_COUNT_SHOW } from "../../../config"

export default class Manager {
  constructor(scene, config) {
    this.scene = scene
    this.progress = window.progress // getProgress()
    this.localProgress = getProgress()
    this.localProgress.stats =
      this.localProgress.stats || this.getDefaultStats()
    this.config = config
  }

  init() {
    this.socket = io("http://192.168.1.19:3001")
    this.socket.on("connect", () => {
      this.socket.emit("ready")

      this.socket.on("opponentTap", (data) =>
        this.changeOpponentDirection(data)
      )

      this.socket.on("opponentDied", () => this.gameOver())

      this.socket.on("start", (data) => {
        this.target_count = 0
        // this.next_target = data.targetsIndexes[0]
        // this.opponent_next_target = data.targetsIndexes[0]

        this.targetsIndexes = data.targetsIndexes
        console.log(this.targetsIndexes)
        this.game_started = true
      })
    })

    this.GUI_helper = helper

    this.GW = this.scene.game.GW
    this.GH = this.scene.game.GH
    this.target_array = []
    this.circles = []
    this.opponent_circles = []
    this.circle_distance_to_circle = null
    this.current_circle = 1
    this.opponent_current_circle = 1
    this.rotation_angle = 270
    this.opponent_rotation_angle = 270
    this.rotation_direction = 1
    this.angle_between = 360 / this.config.targets_amount
    this.game_started = false
    this.is_possible_miss = false
    this.current_target = this.config.starting_target
    this.rotation_speed = this.config.rotation_speed
    this.opponent_rotation_speed = this.config.rotation_speed
    this.intro_duration = 500

    this.perfect_combo = 0
    this.score = 0
    this.perfect = 0

    this.target_texture = "target_" + this.progress.current_skins["targets"]
    this.target_to_catch_texture =
      "targetToCatch_" + this.progress.current_skins["targets"]
  }

  create() {
    if (window.admob) admob.banner.hide()

    this.lose_bg = helper
      .createBackground(this.scene, "black-bg")
      .setAlpha(0)
      .setActive(false)
      .setVisible(false)
      .setDepth(2)

    this.scene.cameras.main.setBackgroundColor(
      this.config.canvas_color || 0x000000
    )
    this.scene.scene.launch("UI", { context: this })
    this.attachSceneListeners()

    this.levelFunctionsCaller = new LevelFunctionsCaller(this.scene)
    this.perfectManager = new PerfectManager(this)
    this.perfectManager.createPerfectText()

    this.helper = new LevelHelper(this)
    // this.helper.randomNextTarget()
    this.next_target = 2
    this.opponent_next_target = 2

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

    this.finger = this.scene.add
      .sprite(this.GW / 2, this.GH - 150, "tap")
      .setDepth(1)
      .setScale(0.7)

    this.scene.tweens.add({
      targets: this.finger,
      duration: 500,
      scale: 0.9,
      yoyo: true,
      repeat: -1,
    })
  }
  showNewLevelUnlockedAlert() {
    const lock = this.scene.add.sprite(this.GW / 2, 0, "general-1", "locked")

    this.scene.tweens.add({
      targets: lock,
      y: "+=150",
      duration: 1000,
      ease: "Power1",
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
    const distance_from_target =
      this.helper.calculateRotatingCircleDistanceToTarget()

    if (!this.hasHitTarget(distance_from_target) && this.is_possible_miss) {
      //  this.gameOver()
      //this.socket.emit("die")
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
  changeOpponentDirection(data) {
    console.log(data)
    this.opponent_circle_distance_to_circle = data.circleDistanceToCircle
    this.opponent_stick.displayWidth = data.stickWidth

    this.opponent_stick.displayWidth =
      this.opponent_circle_distance_to_circle + 10

    this.opponent_next_target = data.nextTarget
    this.opponent_rotation_speed = data.rotationSpeed

    this.opponent_current_circle = 1 - this.opponent_current_circle

    this.opponent_rotation_angle = Phaser.Math.RadToDeg(
      Phaser.Math.Angle.BetweenPoints(
        this.opponent_circles[1 - this.opponent_current_circle],
        this.opponent_circles[this.opponent_current_circle]
      )
    )
  }

  changeBall() {
    this.levelFunctionsCaller.tryChangeRotationSpeed()

    this.rotation_speed += this.config.acceleration

    const distance_from_target =
      this.helper.calculateRotatingCircleDistanceToTarget()

    if (this.hasHitTarget(distance_from_target)) {
      this.levelFunctionsCaller.tryShake()
      this.localProgress.stats.hits++

      if (distance_from_target < 5) {
        this.score += 2
        this.perfect++
        this.perfect_combo++
        this.localProgress.stats.perfects++

        this.perfectManager.showPerfectText()
        this.perfectManager.showPerfectEffect()
        this.perfectManager.handlePerfectCombo(this.perfect_combo)
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

      // this.helper.randomNextTarget()
      this.next_target = this.targetsIndexes[this.target_count]
      this.target_count++

      this.levelFunctionsCaller.trySwapFunctionsToTheNearset()

      //this.helper.checkNewTargetsQueue()

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

      // opponent extend stick

      this.opponent_circle_distance_to_circle = // it is needed to rotate other circle
        Phaser.Math.Distance.BetweenPoints(
          this.opponent_circles[1 - this.opponent_current_circle],
          this.target_array[this.opponent_next_target]
        ) - this.opponent_circles[1 - this.opponent_current_circle].displayWidth

      this.opponent_stick.displayWidth =
        this.opponent_circle_distance_to_circle + 10

      this.levelFunctionsCaller.tryDarkenTargets()

      this.levelFunctionsCaller.tryHideSetForAWhile()

      this.levelFunctionsCaller.tryHideTargets()
    } else {
      this.socket.emit("die")
      this.gameOver()
    }
    this.socket.emit("tap", {
      stickWidth: this.stick.displayWidth,
      circleDistanceToCircle: this.circle_distance_to_circle,
      nextTarget: this.next_target,
      rotationSpeed: this.rotation_speed,
    })
  }
  createGUI() {
    helper.createBackground(this.scene, this.config.background)
  }

  createFirstTarget() {
    this.target_array.push(
      this.scene.add
        .image(0, this.GH / 2, "targets", this.target_texture)
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
      duration: 500,
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

    this.opponent_stick = this.scene.add
      .sprite(
        this.target_array[this.config.starting_target].x,
        this.target_array[this.config.starting_target].y,
        "sticks",
        "stick_" + this.progress.current_skins["sticks"]
      )
      .setOrigin(0, 0.5)
      .setAngle(this.opponent_rotation_angle)
      .setDepth(0.1)
      .setAlpha(0.3)
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

    //////// opponent

    this.opponent_circles[0] = this.scene.add
      .sprite(
        this.opponent_stick.x,
        this.opponent_stick.y,
        "circles",
        "circle_" + this.progress.current_skins["circles"]
      )
      .setDepth(0.1)
      .setAlpha(0.3)

    // opponent extend stick

    this.opponent_circle_distance_to_circle = // it is needed to rotate other circle
      Phaser.Math.Distance.BetweenPoints(
        this.opponent_circles[1 - this.opponent_current_circle],
        this.target_array[this.opponent_next_target]
      ) - this.opponent_circles[1 - this.opponent_current_circle].displayWidth

    this.opponent_stick.displayWidth =
      this.opponent_circle_distance_to_circle + 10

    this.opponent_circles[this.opponent_current_circle] = this.scene.add
      .sprite(
        this.opponent_stick.x,
        this.opponent_stick.y - this.opponent_stick.displayWidth,
        "circles",
        "circle_" + this.progress.current_skins["circles"]
      )
      .setDepth(0.1)
      .setAlpha(0.3)
    //////
    this.updateCircleStickAngle()
  }

  updateCircleStickAngle() {
    ///circles

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

    ///// opponent

    const opponent_static_distance =
      (this.opponent_circle_distance_to_circle ||
        this.opponent_stick.displayWidth) +
      this.opponent_circles[1 - this.opponent_current_circle].displayWidth

    const opponent_radians_angle = Phaser.Math.DegToRad(
      this.opponent_rotation_angle - 90
    )

    const opponent_current_circle_x =
      this.opponent_circles[1 - this.opponent_current_circle].x -
      opponent_static_distance * Math.sin(opponent_radians_angle)

    const opponent_current_circle_y =
      this.opponent_circles[1 - this.opponent_current_circle].y +
      opponent_static_distance * Math.cos(opponent_radians_angle)

    this.opponent_circles[this.opponent_current_circle].setPosition(
      opponent_current_circle_x,
      opponent_current_circle_y
    )

    this.opponent_stick.setAngle(this.opponent_rotation_angle)
    //////// center opponent stick - centerStick()
    const opponent_radians_angleS = Phaser.Math.DegToRad(
      this.opponent_rotation_angle + 90
    )
    const width =
      this.opponent_circles[1 - this.opponent_current_circle].displayWidth / 2

    this.opponent_stick.setPosition(
      this.opponent_circles[1 - this.opponent_current_circle].x +
        width * Math.sin(opponent_radians_angleS),
      this.opponent_circles[1 - this.opponent_current_circle].y -
        width * Math.cos(opponent_radians_angleS)
    )
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
    const plus =
      (((this.rotation_speed * this.scene.delta) / 16) *
        (2 - 1) *
        this.rotation_direction) %
      360

    this.rotation_angle += plus

    const opponent_plus =
      (((this.opponent_rotation_speed * this.scene.delta) / 16) *
        (2 - 1) *
        this.rotation_direction) %
      360
    this.opponent_rotation_angle += opponent_plus
    if (this.scene.rotated_angle) this.scene.rotated_angle += plus
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
  isMysteryLevel() {
    return this.scene.scene.key.split("_")[0].slice(-1) === "-"
  }

  getDefaultStats() {
    return {
      deaths: 0,
      hits: 0,
      perfects: 0,
      achievements: 0,
    }
  }
  gameOver() {
    if (!this.game_started) return

    if (window.admob) {
      admob.banner.show()

      window.ADS_COUNT++
      if (window.ADS_COUNT >= ADS_COUNT_SHOW) {
        window.ADS_COUNT = 0
        admob.interstitial.show()
        admob.interstitial.prepare()
      }
    }

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

    let is_any_update = false

    if (this.isNewLevelNeededScoreReached()) {
      this.is_new_level_unlocked = true
      is_any_update = true
      this.progress.levels_scores[this.scene.level] = 0

      POST_LEVEL_SCORE({
        score: 0,
        nickname: my_nickname,
        level: Utils.convertLevelNumberToLevelName(
          levelsConfiguration[this.scene.level]
        ),
      }).catch(() => checkConnection(this.scene))

      lose_scene.showNextLevelButton()
      lose_scene.showSmallRestartButton()
      lose_scene.hideRestartButton()
    } else {
      lose_scene.showRestartButton()
      lose_scene.hideNextLevelButton()
      lose_scene.hideSmallRestartButton()
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
        level: Utils.convertLevelNumberToLevelName(
          levelsConfiguration[this.scene.level - 1]
        ),
      }).catch(() => checkConnection(this.scene))
    }
    lose_scene.updatePoints(
      this.score,
      this.perfect,
      this.progress.levels_scores[this.scene.level - 1]
    )

    if (this.score > 0 && !this.isMysteryLevel()) {
      this.progress.money += this.score // earned money
      SAVE_MONEY({ money: this.progress.money, nickname: my_nickname }).catch(
        () => checkConnection(this.scene)
      )
    }

    this.localProgress.stats.deaths++

    if (!this.scene.not_count_stats) {
      saveProgress(this.localProgress)
    }

    window.progress = this.progress

    is_any_update && this.scene.scene.get("levelSelect").updateVisiblePage()

    this.lose_bg.setVisible(true).setActive(true)

    this.scene.tweens.add({
      targets: this.lose_bg,
      duration: 400,
      alpha: 1,
    })
  }
}
