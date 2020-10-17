import Manager from "../../main/level-manager.js"

export default class Teleport_Easy extends Phaser.Scene {
  constructor() {
    super("Teleport_Easy")
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
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }

  teleportCircle() {
    const { max, min } = this.manager.config.teleport_value

    let new_circle_index =
      this.manager.next_target + Phaser.Math.Between(max, min)

    new_circle_index = this.manager.helper.normalizeIndexByTargetsAmount(
      new_circle_index
    )

    const target_to_be_teleported_to = this.manager.target_array[
      new_circle_index
    ]

    // if(new_circle_index === 0) not teleport circle to the center ?

    this.manager.circles[1 - this.manager.current_circle].setPosition(
      target_to_be_teleported_to.x,
      target_to_be_teleported_to.y
    )

    this.manager.helper.extendStick()
  }
}
