import Manager from "../main/level-manager.js"

export default class level_18 extends Phaser.Scene {
  constructor() {
    super("level_18")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
  }

  create() {
    this.manager.create()

    this.manager.createGUI()
    this.manager.createFirstTarget()
    this.manager.createTargets()
    this.manager.setNewTarget()

    this.manager.centerTargets()
    //this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)

    this.makeTargetsPulse()
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }

  makeTargetsPulse() {
    this.tweens.add({
      targets: this.manager.target_array,
      alpha: 1,
      duration: 800,
      yoyo: true,
      repeat: -1, // make maybe some stop on yoyo 500 ms or smth
    })
  }
}
