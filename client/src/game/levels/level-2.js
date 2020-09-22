import Manager from "../main/level-manager.js"
import helper from "../helper.js"

export default class level_2 extends Phaser.Scene {
  constructor() {
    super("level_2")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this)
    this.manager.init()

    this.targets_speed = {
      x: this.manager.config.targets_speed,
      y: this.manager.config.targets_speed,
    }
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
    this.moveTargetsAndBounceOffWalls()
  }

  moveTargetsAndBounceOffWalls() {
    this.manager.target_array.forEach((target) => {
      if (
        target.x >= this.game.GW - target.displayWidth / 2 ||
        target.x <= 0 + target.displayWidth / 2
      ) {
        this.targets_speed.x = -this.targets_speed.x
      }
      if (
        target.y >= this.game.GH - target.displayHeight / 2 ||
        target.y <=
          0 + target.displayHeight / 2 + this.manager.top_bar.displayHeight
      ) {
        this.targets_speed.y = -this.targets_speed.y
      }

      this.moveTargetsAndCircles(this.targets_speed)
    })
  }

  moveTargetsAndCircles({ x, y }) {
    this.manager.target_array.forEach((target) => {
      target.x += x
      target.y += y
    })

    const not_rotating_circle = this.manager.circles[
      1 - this.manager.current_circle
    ]

    this.manager.stick.setPosition(not_rotating_circle.x, not_rotating_circle.y)

    not_rotating_circle.x += x
    not_rotating_circle.y += y
  }
}
