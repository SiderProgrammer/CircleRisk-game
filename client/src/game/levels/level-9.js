import Manager from "../main/level-manager.js"
import helper from "../helper.js"

export default class level_9 extends Phaser.Scene {
  constructor() {
    super("level_9")
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

    const fake_target_index = this.calculateFakeTargetIndex()
    this.setFakeTargetToCatch(fake_target_index)

    helper.sceneIntro(this)
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }

  handleFakeTargetToCatch() {
    this.removeFakeTarget()
    const fake_target_index = this.calculateFakeTargetIndex()
    this.setFakeTargetToCatch(fake_target_index)
  }

  setFakeTargetToCatch(index) {
    this.fake_target = this.manager.target_array[index]
    this.fake_target.setTexture(this.manager.target_to_catch_texture)
  }

  calculateFakeTargetIndex() {
    let index_shift = 0
    Phaser.Math.Between(0, 1) === 1 ? (index_shift = 1) : (index_shift = -1) /// can assign index shift to 1 and change only if != 1

    let index = this.manager.next_target + index_shift
    if (index === this.manager.current_target) index += 2

    if (index > this.manager.config.targets_amount - 1) {
      index = Phaser.Math.Between(
        1,
        index - this.manager.config.targets_amount - 1
      )
    } else if (index < 0) {
      index = this.manager.config.targets_amount + index
    }

    return index
  }

  removeFakeTarget() {
    this.fake_target.setTexture(this.manager.target_texture)
  }
}
