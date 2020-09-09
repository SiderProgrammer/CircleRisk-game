import Manager from "../main/levelBasic.js";
import helper from "../helper.js";

export default class level_7 extends Phaser.Scene {
  constructor() {
    super("level_7");
  }

  init(config) {
    this.level = config.level;
    this.score_to_next_level = config.score_to_next_level;

    this.manager = new Manager(this);
    this.manager.init();
    this.fly_value = 1;
  }

  create() {
    this.manager.create();

    this.manager.createGUI();
    this.manager.createFirstTarget();
    this.manager.createTargets();
    this.manager.setNewTarget();

    this.manager.centerTargets();
    this.manager.showTargets();
    this.manager.createStick();
    this.manager.createCircles();
    this.manager.bindInputEvents();
    this.manager.createScoreText();

    helper.sceneIntro(this);
    const pos = this.manager.target_array.reduce((acc, tar) => {
      if (acc.texture) {
        acc = {
          x: tar.x,
          minX: tar.x,
        };
      } else {
        if (acc.x < tar.x) {
          acc.x = tar.x;
        }

        if (acc.minX > tar.x) {
          acc.minX = tar.x;
        }
      }
      return acc;
    });

    this.distance = (pos.x - pos.minX) / 2;

    this.time.addEvent({
      delay: 1500,
      callback: this.changeFlyDirection,
      callbackScope: this,
      loop: true,
    });
  }
  update() {
    if (!this.manager.game_started) return;
    this.manager.updateRotationAngle();
    this.manager.updateCircleStickAngle();
    this.manager.checkIfMissedTarget();

    this.flyTargets();
    this.setCirclesPosition();

    this.manager.helper.extendStick();
    this.manager.helper.centerStick();
    this.distance += this.fly_value;
  }

  setCirclesPosition() {
    this.manager.circles[
      1 - this.manager.current_circle
    ].x = this.manager.target_array[this.manager.current_target].x;
    this.manager.circles[
      1 - this.manager.current_circle
    ].y = this.manager.target_array[this.manager.current_target].y;
  }

  flyTargets() {
    this.manager.target_array.forEach((target, i) => {
      const radians_angle = Phaser.Math.DegToRad(
        this.manager.angle_between * (i - 1)
      );

      const targetX =
        this.game.GW / 2 + this.distance * Math.sin(radians_angle);
      const targetY =
        this.game.GH / 2 +
        this.manager.top_bar.displayHeight / 2 +
        this.distance * Math.cos(radians_angle);

      target.setPosition(targetX, targetY);
    });
  }
  changeFlyDirection() {
    this.fly_value = -this.fly_value;
  }
}
