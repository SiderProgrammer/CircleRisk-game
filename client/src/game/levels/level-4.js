import Manager from "../main/level-manager.js"
import helper from "../helper.js"

export default class level_4 extends Phaser.Scene {
  constructor() {
    super("level_4")
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

    helper.sceneIntro(this)
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
  slideCircle() {
    const radians_angle = this.manager.rotation_angle - 90
    const width =
      this.manager.stick.displayWidth +
      this.manager.circles[this.manager.current_circle].displayWidth

    this.tweens.add({
      targets: this.manager.circles[1 - this.manager.current_circle],
      x:
        this.manager.circles[this.manager.current_circle].x +
        width * Math.sin(Phaser.Math.DegToRad(radians_angle + 10)),
      y:
        this.manager.circles[this.manager.current_circle].y -
        width * Math.cos(Phaser.Math.DegToRad(radians_angle + 10)),
      duration: 500,
      onUpdate: () => {
        this.manager.helper.extendStick()
        this.manager.helper.centerStick()
      },
      onComplete: () => {
        return
      }, //check if missed target
    })
  }
}
