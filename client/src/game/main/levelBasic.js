import level_config from "../settings/levelsConfig.js";
import LevelHelper from "./levelHelper.js";
import helper from "../helper.js";
import progress from "../settings/progress";

export default class Manager {
  constructor(scene) {
    this.scene = scene;
    this.progress = progress.levels[`level_${scene.level}`];
    this.config = level_config[`level_${scene.level}`];
  }

  init() {
    this.GW = this.scene.game.GW;
    this.GH = this.scene.game.GH;
    this.target_array = [];
    this.circles = [];
    this.current_circle = 1;
    this.rotation_angle = 270;
    this.rotation_direction = 1;
    this.angle_between = 360 / this.config.targets_amount;
    this.game_started = false;
    this.is_possible_miss = false;
    this.current_target = this.config.starting_target;
    this.score = 0;
    this.perfect = 0;
  }
  create() {
    this.helper = new LevelHelper(this);
    this.helper.randomNextTarget();
    this.createPerfectText();
    this.stars = this.scene.add.particles("star").setDepth(1);
  }
  createPerfectText() {
    this.perfect_text = this.scene.add
      .image(this.GW / 2, 150, "perfect")
      .setAlpha(0)
      .setScale(0.5)
      .setDepth(1);
  }
  createScoreText() {
    this.score_text = this.scene.add.text(
      this.scene.game.GW - 100,
      20,
      this.updateScoreText(),
      {
        font: "30px LuckiestGuy",
      }
    );
    //.setDepth(1);
  }

  updateScoreText() {
    return this.score + "/" + this.scene.score_to_next_level;
  }
  checkIfMissedTarget() {
    const distance_from_target = Phaser.Math.Distance.BetweenPoints(
      this.circles[this.current_circle],
      this.target_array[this.next_target]
    );

    if (distance_from_target > 90 && this.is_possible_miss) {
      // this.gameOver();
    }

    if (distance_from_target < 10) {
      this.is_possible_miss = true;
    }
  }

  showPerfectText() {
    this.scene.tweens.add({
      targets: this.perfect_text,
      scale: 1,
      alpha: 1,
      duration: 500,
      ease: "Bounce.easeOut",
      onComplete: () => this.perfect_text.setAlpha(0).setScale(0.5),
    });
  }

  showPerfectEffect() {
    // perfect
    const stars_emtiter = this.stars.createEmitter({
      x: this.circles[this.current_circle].x,
      y: {
        min: this.circles[this.current_circle].y - 30,
        max: this.circles[this.current_circle].y + 30,
      },
      lifespan: 1500,
      speedX: { min: -200, max: 200 },
      scale: { start: 1, end: 0 },
      speedY: { min: 50, max: -200 },
      gravityY: 150,
      quantity: -1,

      maxParticles: 8,
      tint: [0xffff00, 0xff0000, 0x00ff00, 0x0000ff],
    });
    stars_emtiter.explode(8);
  }

  changeBall() {
    const distance_from_target = Phaser.Math.Distance.BetweenPoints(
      this.circles[this.current_circle],
      this.target_array[this.next_target]
    );

    if (distance_from_target < 90) {
      if (distance_from_target < 10) {
        this.score += 2;
        this.perfect++;
        this.showPerfectText();
        this.showPerfectEffect(); // repair
      } else {
        this.score++;
      }

      this.score_text.setText(this.updateScoreText());
      this.is_possible_miss = false;

      if (typeof this.scene.calculateCirclesPosition === "function") {
        this.scene.calculateCirclesPosition();
      }

      this.current_target = this.next_target;
      this.target_array[this.current_target].setTexture("target_1");

      this.helper.randomNextTarget();
      this.helper.checkNewTargetsQueue();

      this.setNewTarget();

      this.stick.setPosition(
        this.circles[this.current_circle].x,
        this.circles[this.current_circle].y
      );

      this.current_circle = 1 - this.current_circle;

      this.rotation_angle = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.BetweenPoints(
          this.circles[1 - this.current_circle],
          this.circles[this.current_circle]
        )
      );

      this.stick.setAngle(this.rotation_angle);

      if (typeof this.scene.slideCircle === "function") {
        this.scene.slideCircle();
      }

      this.helper.extendStick();

      if (typeof this.scene.darkenTargets === "function") {
        this.scene.darkenTargets();
      }
    } else {
      this.gameOver();
    }
  }
  createGUI() {
    helper.createBackground(this.scene, this.config.background);
    this.top_bar = helper.createTopBar(this.scene, "top-bar"); //.setDepth(1);

    helper
      .createButton(this.scene, 10, 10, "home-button", () =>
        this.scene.scene.start("menu")
      )
      // .setDepth(1)
      .setOrigin(0);
  }

  createFirstTarget() {
    this.target_array.push(
      this.scene.add.image(0, this.GH / 2, "target_1").setAlpha(0)
    );
  }
  createTargets() {
    for (let i = 0; i < this.config.targets_amount - 1; i++) {
      this.addTarget().setAlpha(0);
    }
  }
  setNewTarget() {
    this.target_array[this.next_target].setTexture("targetToCatch_1");
  }
  showTargets() {
    this.scene.tweens.add({
      targets: this.target_array,
      duration: 300,
      alpha: 1,
    });
  }
  createStick() {
    this.stick = this.scene.add
      .sprite(
        this.target_array[this.config.starting_target].x,
        this.target_array[this.config.starting_target].y,
        "stick_1"
      )
      .setOrigin(0, 0.5)
      .setAngle(this.rotation_angle);
  }
  createCircles() {
    this.circles[0] = this.scene.add.sprite(
      this.stick.x,
      this.stick.y,
      "circle_1"
    );

    this.helper.extendStick();

    this.circles[this.current_circle] = this.scene.add.sprite(
      this.stick.x,
      this.stick.y - this.stick.displayWidth,
      "circle_1"
    );
  }
  bindInputEvents() {
    this.scene.input.on("pointerdown", () => {
      this.scene.add.text(150, 150, this.scene.game.loop.actualFps);
      if (!this.game_started) {
        this.game_started = true;
      } else {
        this.changeBall();
      }
    });
  }

  updateRotationAngle() {
    this.rotation_angle =
      (this.rotation_angle +
        this.config.rotation_speed * (2 - 1) * this.rotation_direction) %
      360;
  }
  updateCircleStickAngle() {
    this.stick.setAngle(this.rotation_angle);

    const radians_angle = Phaser.Math.DegToRad(this.rotation_angle - 90);

    const current_circle_x =
      this.circles[1 - this.current_circle].x -
      this.stick.displayWidth * Math.sin(radians_angle);

    const current_circle_y =
      this.circles[1 - this.current_circle].y +
      this.stick.displayWidth * Math.cos(radians_angle);

    this.circles[this.current_circle].setPosition(
      current_circle_x,
      current_circle_y
    );
  }

  addTarget() {
    const startX = this.target_array[this.target_array.length - 1].x;
    const startY = this.target_array[this.target_array.length - 1].y;

    const radians_angle = Phaser.Math.DegToRad(
      this.config.additional_angle +
        this.angle_between * this.target_array.length
    );

    const targetX =
      startX + this.config.ball_distance * Math.sin(radians_angle);
    const targetY =
      startY + this.config.ball_distance * Math.cos(radians_angle);

    const target = this.scene.add.image(targetX, targetY, "target_1");

    this.target_array.push(target);
    return target;
  }

  centerTargets() {
    const pos = this.helper.calculateMinMaxTargetsPos();

    const differenceX = pos.x - pos.minX;
    const newX = (this.GW - differenceX) / 2;
    const target_shiftX = newX - pos.minX;

    const differenceY = pos.y - pos.minY;
    const newY = (this.GH - differenceY) / 2;
    const target_shiftY = newY - pos.minY + this.top_bar.displayHeight / 2;

    this.target_array.forEach((target) => {
      target.x += target_shiftX;
      target.y += target_shiftY;
    });
  }

  gameOver() {
    this.scene.input.removeAllListeners();
    this.game_started = false;

    if (this.score > this.progress.score) {
      this.progress.score = this.score;
    }

    const earned_money = this.score;
    progress.money += earned_money;

    const bg = this.scene.add
      .image(this.GW / 2, this.GH / 2, "black-bg")
      .setAlpha(0);

    this.scene.tweens.add({
      targets: bg,
      duration: 400,
      alpha: 1,
      onComplete: () => this.showStats(),
    });
  }

  showStats() {
    const blue_square = this.scene.add
      .image(this.GW / 2, 20, "blue-square")
      .setOrigin(0.5, 0);

    const blue_strap = this.scene.add
      .image(0, 100, "blue-strap")
      .setOrigin(0, 0.5);

    blue_strap.displayWidth = this.GW;

    this.scene.add
      .text(this.GW / 2, blue_strap.y, "SCORE", {
        font: "60px LuckiestGuy",
      })
      .setOrigin(0.5);

    const divider = this.scene.add
      .text(this.GW / 2, blue_strap.y + 90 + 15, "/", {
        font: "50px LuckiestGuy",
      })
      .setOrigin(0.5);

    const score_text = this.scene.add
      .text(
        divider.x - divider.displayWidth / 2,
        blue_strap.y + 90,
        this.score,
        {
          font: "90px LuckiestGuy",
        }
      )
      .setOrigin(1, 0.5);

    const needed_score_text = this.scene.add
      .text(
        divider.x + divider.displayWidth / 2,
        blue_strap.y + 90 + 15,
        this.scene.score_to_next_level,
        {
          font: "50px LuckiestGuy",
        }
      )
      .setOrigin(0, 0.5);

    const red_strap = this.scene.add
      .image(
        this.GW / 2,
        blue_strap.y + blue_strap.displayHeight / 2 + 200,
        "red-strap"
      )
      .setOrigin(0, 0.5);

    red_strap.displayWidth = this.GW / 2;

    const best_text = this.scene.add
      .text(red_strap.x + red_strap.displayWidth / 2, red_strap.y, "BEST", {
        font: "45px LuckiestGuy",
      })
      .setOrigin(0.5);

    const best_score_text = this.scene.add
      .text(
        red_strap.x + red_strap.displayWidth / 2,
        red_strap.y + red_strap.displayHeight / 2 + 30,
        this.progress.score,
        {
          font: "60px LuckiestGuy",
        }
      )
      .setOrigin(0.5);

    const purple_strap = this.scene.add
      .image(
        this.GW / 2,
        blue_strap.y + blue_strap.displayHeight / 2 + 200,
        "purple-strap"
      )
      .setOrigin(1, 0.5);

    purple_strap.displayWidth = this.GW / 2;

    const perfect_text = this.scene.add
      .text(
        purple_strap.x - purple_strap.displayWidth / 2,
        purple_strap.y,
        "PERFECT",
        {
          font: "45px LuckiestGuy",
        }
      )
      .setOrigin(0.5);

    const perfect_amount_text = this.scene.add
      .text(
        purple_strap.x - purple_strap.displayWidth / 2,
        purple_strap.y + purple_strap.displayHeight / 2 + 30,
        this.perfect,
        {
          font: "60px LuckiestGuy",
        }
      )
      .setOrigin(0.5);

    helper.createButton(
      this.scene,
      this.GW / 2,
      this.GH - 200,
      "replay-button",
      () => this.scene.scene.restart()
    );
    helper.createButton(
      this.scene,
      this.GW / 2 - 120,
      this.GH - 100,
      "customize-button",
      () => helper.sceneTransition(this.scene, "customize")
    );
    helper.createButton(
      this.scene,
      this.GW / 2 + 120,
      this.GH - 100,
      "levelSelect-button",
      () => helper.sceneTransition(this.scene, "levelSelect")
    );
  }
}
