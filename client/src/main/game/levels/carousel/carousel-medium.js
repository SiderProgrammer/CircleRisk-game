import Manager from "../../main/level-manager.js"
import CarouselFunctionsManager from "./functions"
import TwinsFunctionsManager from "../twins/functions"

export default class Carousel_Medium extends Phaser.Scene {
  constructor() {
    super("Carousel_Medium")
  }

  init(config) {
    this.level = config.level
    this.score_to_next_level = config.score_to_next_level

    this.manager = new Manager(this, config.config)
    this.manager.init()

    this.targets_speed = this.manager.config.targets_speed
    this.carouselFunctionsManager = new CarouselFunctionsManager(this)
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

    this.twinsFunctionsManager = new TwinsFunctionsManager(this)

    const fake_target_index = this.twinsFunctionsManager.calculateFakeTargetIndex()
    this.twinsFunctionsManager.setFakeTargetToCatch(fake_target_index)

    this.carouselFunctionsManager.extractBouncingTargets()
    /*
    this.anims.create({
      key: "boost",
      frames: this.anims.generateFrameNumbers("boost", {
        start: 0,
        end: 3,
      }),
      repeat: 3,
      frameRate: 2,
    })

    this.boost = this.add
      .sprite(this.game.GW / 2, this.game.GH / 2 - 200, "boost")
      .setVisible(false)
      */
  }
  update() {
    if (!this.manager.game_started) return
    this.manager.updateRotationAngle()
    this.manager.updateCircleStickAngle()
    this.manager.checkIfMissedTarget()
    /*
    if (
      this.manager.target_array.some((target) =>
        this.carouselFunctionsManager.isBouncingWallX(target)
      )
    ) {
      this.boost.setVisible(true) //.play("boost")
      console.log("s")
    }
    */
    this.carouselFunctionsManager.moveTargetsAndBounceOffWalls()
  }

  handleFakeTargetToCatch() {
    this.twinsFunctionsManager.handleFakeTargetToCatch()
  }
}
