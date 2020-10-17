import Manager from "../../main/level-manager.js"

export default class Blind_Easy extends Phaser.Scene {
  constructor() {
    super("Blind_Easy")
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
    this.manager.showTargets()
    this.manager.createStick()
    this.manager.createCircles()
    this.manager.bindInputEvents()

    this.manager.GUI_helper.sceneIntro(this)

    this.blind = this.manager.GUI_helper.createBackground(this, "black")
    this.blindTheScreen()
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }

  blindTheScreen() {
    this.blind.setVisible(true)
    setTimeout(() => {
      this.blind.setVisible(false)
      // change set timeouts to phaser timer function (setimeout will execute even if level is done)
      setTimeout(() => this.blindTheScreen(), Phaser.Math.Between(4000, 7000))
    }, 1000)
  }
}
