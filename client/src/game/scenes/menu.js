import * as helper from "../helper"
import { saveProgress, getProgress } from "../../shortcuts/save"
import {
  GET_ACCOUNT_PROGRESS,
  GET_CUSTOMIZE_SKINS_SETUP,
} from "../../shortcuts/requests"
import { START_FETCHING_SCENE, STOP_FETCHING_SCENE } from "../../fetch-helper"

export default class menu extends Phaser.Scene {
  constructor() {
    super("menu")
    this.is_everything_fetched = false
    this.customize_skins_setup = {}

    this.tween_duration = 300
  }

  async init() {
    if (!this.is_everything_fetched) {
      START_FETCHING_SCENE(this)
      await this.getCustomizeSkinsSetup()
      await this.restoreProgress()
      await this.finishFetching()
    }
  }

  create() {
    helper.createBackground(this, "menu-bg")

    this.createPlayButtonSet()
    this.createCustomizeButtonSet()

    this.showButtons()
    this.showLogos()

    helper.sceneIntro(this)
  }

  async finishFetching() {
    this.is_everything_fetched = true
    STOP_FETCHING_SCENE(this)
  }

  async getCustomizeSkinsSetup() {
    await GET_CUSTOMIZE_SKINS_SETUP()
      .then((setup) => (this.customize_skins_setup = setup))
      .catch((error) => console.log(error))
  }

  async restoreProgress() {
    const local_progress = getProgress()

    await GET_ACCOUNT_PROGRESS({ nickname: local_progress.nickname }).then(
      (progress) => {
        // converting skin numbers into full name strings
        Object.keys(progress.skins).forEach((item) => {
          progress.skins[item].forEach((skin_number, index, array) => {
            array[index] =
              item.substring(0, item.length - 1) + "_" + skin_number
          })
        })

        saveProgress(progress)
      }
    )
  }

  showLogos() {
    helper
      .createButton(this, 20, 20, "geometrytrinity", () =>
        window.open(
          "https://play.google.com/store/apps/details?id=com.pip.geometrytrinity",
          "_blank"
        )
      )
      .setOrigin(0)

    helper
      .createButton(this, this.game.GW - 20, 20, "instagram", () => {
        window.open("https://www.instagram.com/pip_games/", "_blank")
      })
      .setOrigin(1, 0)
  }
  hideButtons() {
    return new Promise((resolve) => {
      this.customizeButtonTween(20)
      setTimeout(() => {
        this.playButtonTween(-20).then(() => resolve())
      }, this.tween_duration / 2)
    })
  }

  showButtons() {
    this.playButtonTween("-=35")
    setTimeout(() => this.customizeButtonTween(-40), this.tween_duration / 2)
  }

  customizeButtonTween(angle) {
    return new Promise((resolve, reject) => {
      this.tweens.add({
        targets: this.customize_stick,
        angle: angle,
        duration: this.tween_duration,
        onUpdate: () => {
          const angle = Phaser.Math.DegToRad(this.customize_stick.angle)

          const x =
            this.customize_stick.x +
            (this.customize_stick.displayWidth +
              this.customize_button.displayWidth / 2 -
              10) *
              Math.cos(angle)

          const y =
            this.customize_stick.y -
            (this.customize_button.displayWidth / 2 +
              this.customize_stick.displayWidth -
              10) *
              -Math.sin(angle)

          this.customize_button.x = x
          this.customize_button.y = y
        },
        onComplete: () => resolve(),
      })
    })
  }

  playButtonTween(angle) {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: this.play_stick,
        angle: angle,
        duration: this.tween_duration,
        onUpdate: () => {
          const angle = Phaser.Math.DegToRad(this.play_stick.angle)

          const x =
            this.play_stick.x -
            (this.play_stick.displayWidth +
              this.play_button.displayWidth / 2 +
              5) *
              Math.cos(angle)

          const y =
            this.play_stick.y -
            (this.play_button.displayWidth / 2 +
              this.play_stick.displayWidth -
              5) *
              Math.sin(angle)

          this.play_button.x = x
          this.play_button.y = y
        },
        onComplete: () => resolve(),
      })
    })
  }

  createStick(x, y, origin, target, sprite) {
    const stick = this.add.image(x, y, sprite)

    stick.setOrigin(origin.x, origin.y)

    stick.displayWidth =
      Phaser.Math.Distance.Between(stick.x, stick.y, target.x, target.y) -
      target.displayWidth / 2

    return stick
  }

  createCustomizeButtonSet() {
    this.customize_button = helper
      .createButton(this, 0, this.game.GH / 2 + 200, "customize-button", () => {
        this.hideButtons().then(() =>
          helper.sceneTransition(this, "customize", {
            setup: this.customize_skins_setup,
          })
        )
      })
      .setDepth(1)

    this.customize_button.x -= this.customize_button.displayWidth / 2

    this.customize_stick = this.createStick(
      0,
      this.game.GH + 10,
      { x: 0, y: 0.5 },
      this.customize_button,
      "menu-stick-blue"
    )
    this.customize_stick.x -= this.customize_stick.displayHeight / 2
    const angle_between = Phaser.Math.Angle.BetweenPoints(
      this.customize_button,
      this.customize_stick
    )
    this.customize_stick.setAngle(Phaser.Math.RadToDeg(angle_between) + 180)
  }

  createPlayButtonSet() {
    this.play_button = helper
      .createButton(
        this,
        this.game.GW,
        this.game.GH / 2 + 80,
        "play-button",
        () => {
          this.hideButtons().then(() =>
            helper.sceneTransition(this, "levelSelect")
          )
        }
      )
      .setDepth(1)
    this.play_button.x += this.play_button.displayWidth / 2

    this.play_stick = this.createStick(
      this.game.GW,
      this.game.GH + 10,
      { x: 1, y: 0.5 },
      this.play_button,
      "menu-stick-yellow"
    )

    const angle_between = Phaser.Math.Angle.BetweenPoints(
      this.play_button,
      this.play_stick
    )
    this.play_stick.setAngle(Phaser.Math.RadToDeg(angle_between))
    this.play_button.setAngle(Phaser.Math.RadToDeg(angle_between))
  }
}

/*
import helper from "../helper";

export default class menu extends Phaser.Scene {
  constructor() {
    super("menu");
  }
  init() {
    this.tween_duration = 800;
  }
  create() {
    helper.createBackground(this, "menu-bg");

    this.createPlayButtonSet();
    this.createCustomizeButtonSet();

    this.showButtons();
  }

  showButtons() {
    this.showPlayButton().then(() => this.showCustomizeButton());
  }

  showPlayButton() {
    return new Promise((resolve, reject) => {
      this.tweens.add({
        targets: this.play_stick,
        angle: +75,
        duration: this.tween_duration,
        ease: "Bounce.easeOut",
        onUpdate: () => {
          const angle = Phaser.Math.DegToRad(this.play_stick.angle);

          const x =
            this.play_stick.x -
            (this.play_button.displayWidth / 2 - this.play_stick.displayWidth) *
              -Math.cos(angle);

          const y =
            this.play_stick.y +
            (this.play_button.displayWidth / 2 + this.play_stick.displayWidth) *
              -Math.sin(angle);

          this.play_button.x = x;
          this.play_button.y = y;
          // this.play_button.setPosition(x, y);
        },
        onComplete: () => resolve(),
      });
    });
  }

  showCustomizeButton() {
    return new Promise((resolve, reject) => {
      this.tweens.add({
        targets: this.customize_stick,
        angle: -50,
        duration: this.tween_duration,
        ease: "Bounce.easeOut",
        onUpdate: () => {
          const angle = Phaser.Math.DegToRad(this.customize_stick.angle);

          const x =
            this.customize_stick.x +
            (this.customize_button.displayWidth / 2 +
              this.customize_stick.displayWidth) *
              Math.cos(angle);

          const y =
            this.customize_stick.y +
            (this.customize_button.displayWidth / 2 +
              this.customize_stick.displayWidth) *
              Math.sin(angle);

          this.customize_button.setPosition(x, y);
        },
        onComplete: () => resolve(),
      });
    });
  }

  createStick(x, y, origin, target) {
    const stick = this.add.image(x, y, "stick_1");

    stick.setOrigin(origin.x, origin.y);

    stick.displayWidth =
      Phaser.Math.Distance.Between(stick.x, stick.y, target.x, target.y) -
      target.displayWidth / 2;

    return stick;
  }

  createCustomizeButtonSet() {
    this.customize_button = helper.createButton(
      this,
      this.game.GW / 2 + 100,
      this.game.GH,
      "customize-button",
      () => this.scene.start("customize")
    );

    this.customize_stick = this.createStick(
      0,
      this.game.GH,
      { x: 0, y: 0.5 },
      this.customize_button
    );
  }

  createPlayButtonSet() {
    this.play_button = helper.createButton(
      this,
      this.game.GW / 2 - 200,
      this.game.GH,
      "play-button",
      () => this.scene.start("levelSelect")
    );

    this.play_stick = this.createStick(
      this.game.GW,
      this.game.GH,
      { x: 1, y: 0.5 },
      this.play_button
    );
  }
}

*/
