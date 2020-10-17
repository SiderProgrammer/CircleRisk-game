import Manager from "../../main/level-manager.js"

export default class Clock_Easy extends Phaser.Scene {
  constructor() {
    super("Clock_Easy")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.time_left = this.manager.config.time_left
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.createTimerText()

    this.manager.GUI_helper.sceneIntro(this)
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }

  createTimerText() {
    this.time_left_text = this.add
      .text(this.game.GW / 2, 170, this.time_left, {
        font: "100px LuckiestGuy",
      })
      .setOrigin(0.5, 0.5)
  }
  setTimer() {
    this.timer = this.time.addEvent({
      delay: 1000, // ms
      callback: () => this.timerTick(),
      repeat: this.time_left,
    })
  }

  timerTick() {
    this.time_left--
    if (this.time_left === 0) {
      this.timer.remove()
      this.manager.gameOver()
    }
    this.time_left_text.setText(this.time_left)
  }
}
