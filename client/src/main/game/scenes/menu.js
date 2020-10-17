import * as helper from "../GUI-helper"
import { saveProgress, getProgress } from "../../shortcuts/save"
import {
  GET_ACCOUNT_PROGRESS,
  GET_CONFIGURATIONS,
} from "../../shortcuts/requests"
import { START_FETCHING_SCENE, STOP_FETCHING_SCENE } from "../../fetch-helper"

export default class menu extends Phaser.Scene {
  constructor() {
    super("menu")
    this.is_everything_fetched = false

    this.tween_duration = 300
  }

  init() {
    if (!this.is_everything_fetched) {
      START_FETCHING_SCENE(this)
      this.fetchFromServer()
    }
  }

  create() {
    helper.createBackground(this, "menu-bg")

    this.createPlayButton()
    // this.createCustomizeButtonSet()

    // this.showButtons()
    this.showLogos()

    helper.sceneIntro(this)
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

  createPlayButton() {
    this.play_button = helper.createButton(
      this,
      this.game.GW / 2,
      this.game.GH - 300,
      "play-button-big",
      () => {
        helper.sceneTransition(this, "levelSelect")
      }
    )
  }
  /*
  hideButtons() {
    return new Promise((resolve) => {
      this.customizeButtonTween(85)
      setTimeout(() => {
        this.playButtonTween(-87).then(() => resolve())
      }, this.tween_duration / 2)
    })
  }

  showButtons() {
    this.playButtonTween("-=55")
    setTimeout(() => this.customizeButtonTween(-40), this.tween_duration / 2)
  }

  customizeButtonTween(angle) {
    return new Promise((resolve) => {
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
              0) *
              Math.cos(angle)

          const y =
            this.play_stick.y -
            (this.play_button.displayWidth / 2 +
              this.play_stick.displayWidth -
              0) *
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
      .createButton(this, 0, this.game.GH - 250, "customize-button-big", () => {
        this.hideButtons().then(() => helper.sceneTransition(this, "customize"))
      })
      .setDepth(1)

    this.customize_button.x -= this.customize_button.displayWidth / 2

    this.customize_stick = this.createStick(
      0,
      this.game.GH - 50,
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
        this.game.GH - 430,
        "play-button-big",
        () => {
          this.hideButtons().then(() =>
            helper.sceneTransition(this, "levelSelect")
          )
        }
      )
      .setDepth(1)
    this.play_button.x += this.play_button.displayWidth / 2

    this.play_stick = this.createStick(
      this.game.GW + 20,
      this.game.GH - 120,
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
*/

  async fetchFromServer() {
    try {
      await this.getConfigurations()
      await this.restoreProgress()
      this.finishFetching()
    } catch {
      // if something went wrong, try to fetch again
      setTimeout(() => {
        this.fetchFromServer()
      }, 3000)
    }
  }

  finishFetching() {
    this.is_everything_fetched = true
    STOP_FETCHING_SCENE(this)
  }

  async getConfigurations() {
    const response = await GET_CONFIGURATIONS()
    window.customize_skins_setup = response.skins_setup

    // assign to window because the level select scene can be started by many scenes,
    //not like customize scene which is started only from menu
    // WINDOW ASSIGNED VARIABLES LIKE NICKNAME CAN BE EASY HACKED  !!!
    window.levelsConfiguration = response.levels_config
  }

  async restoreProgress() {
    const local_progress = getProgress()
    window.my_nickname = local_progress.nickname

    const progress = await GET_ACCOUNT_PROGRESS({ nickname: my_nickname })

    // converting skin numbers into full name strings
    Object.keys(progress.skins).forEach((item) => {
      progress.skins[item].forEach((skin_number, index, array) => {
        array[index] = item.substring(0, item.length - 1) + "_" + skin_number
      })
    })

    saveProgress(progress)
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
