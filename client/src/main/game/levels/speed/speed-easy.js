import Manager from "../../main/level-manager.js"

export default class Speed_Easy extends Phaser.Scene {
  constructor() {
    super("Speed_Easy")
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
    /*
    const lightning = this.add.image(this.game.GW/2,this.game.GH/2,"lightning").setAlpha(0)

    this.tweens.add({
      targets:lightning,
      alpha:1,
      duration:6000,
      yoyo:true,
      hold:2000,
      repeat:-1
    })

    */
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
  }
}
