import Manager from "../main/levelBasic.js"
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
    const t_speed = this.manager.config.targets_speed
    const targets_speed = {
      x: t_speed,
      y: t_speed,
    }

    this.manager.target_array.forEach((target) => {
      if (target.x >= this.game.GW - target.displayWidth / 2) {
        targets_speed.x = -t_speed
      } else if (target.x <= 0 + target.displayWidth / 2) {
        targets_speed.x = t_speed
      }
      if (target.y >= this.game.GH - target.displayHeight / 2) {
        targets_speed.y = -t_speed
      } else if (
        target.y <=
        0 + target.displayHeight / 2 + this.manager.top_bar.displayHeight
      ) {
        targets_speed.y = t_speed
      }

      this.moveTargetsAndCircles(targets_speed)
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
