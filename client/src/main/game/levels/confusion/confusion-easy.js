import Manager from "../../main/level-manager.js"

export default class Confusion_Easy extends Phaser.Scene {
  constructor() {
    super("Confusion_Easy")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()
    this.fake_targets = []
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

  handleFakeTargetsToCatch() {
    if (this.fake_targets.length > 0) {
      this.fake_targets.forEach((target) => {
        this.removeFakeTargetTexture(target)
      })
    }

    const fake_targets_amount = Phaser.Math.Between(1, 5)

    for (let i = 0; i < fake_targets_amount; i++) {
      this.fake_targets[i] = Phaser.Math.Between(
        0,
        this.manager.config.targets_amount - 1
      )

      this.setFakeTargetTexture(this.fake_targets[i])
    }
  }

  removeFakeTargetTexture(index) {
    this.manager.target_array[index].setTexture(this.manager.target_texture)
  }

  setFakeTargetTexture(index) {
    this.manager.target_array[index].setTexture(
      this.manager.target_to_catch_texture
    )
  }

  removeCorrectTargetTextureToCatch() {
    if (Phaser.Math.Between(0, 1) === 1) {
      // 50 percent
      this.manager.target_array[this.manager.next_target].setTexture(
        this.manager.target_texture
      )
    }
  }
}
