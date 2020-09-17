import helper from "../helper";
import setup from "../settings/customizeSetup";
import {saveProgress,getProgress} from "../../shortcuts/save"

export default class Customize extends Phaser.Scene {
  constructor() {
    super("customize");
  }

  init() {
    this.setup = setup;

    this.hidden_scale = 0.7;
    this.shift_value = 90;
    this.shift_duration = 400;
    this.can_change = true;
    this.progress = getProgress()
  }

  create() {
    helper.createBackground(this, "customize-bg");
    helper.createTopBar(this, "shop-top-bar");

    helper
      .createButton(this, 10, 10, "home-button", () => this.scene.start("menu"))
      .setOrigin(0);

    this.coin = this.add.image(this.game.GW - 10, 10, "coin").setOrigin(1, 0);
    this.add
      .text(this.coin.x - this.coin.displayWidth - 20, 10, this.progress.money, {
        font: "40px LuckiestGuy",
      })
      .setOrigin(1, 0);

    this.createCircleSet();
    this.createStickSet();
    this.createTargetSet();
    helper.sceneIntro(this);
  }
  createStickSet() {
    this.stick_skin_number = 0;

    const stick = this.add
      .image(
        this.game.GW / 2,
        this.circle.y + this.circle.displayHeight / 2,
        "stick_1"
      )
      .setAngle(90);

    this.stick = stick;

    const other_stick = this.add
      .image(stick.x, stick.y, stick.texture.key)
      .setAngle(90);

    stick.y += stick.displayWidth / 2;
    other_stick.y += stick.displayWidth / 2;

    helper.createButton(this, stick.x - 100, stick.y, "arrow-button", () => {
      if (!this.can_change) return;
      this.stick_skin_number--;
      this.changeSkinButtonClicked(
        stick,
        other_stick,
        "sticks",
        "+",
        this.stick_skin_number
      );
    });

    helper
      .createButton(this, stick.x + 100, stick.y, "arrow-button", () => {
        if (!this.can_change) return;

        this.stick_skin_number++;
        this.changeSkinButtonClicked(
          stick,
          other_stick,
          "sticks",
          "-",
          this.stick_skin_number
        );
      })
      .setFlipX(true);
  }

  createTargetSet() {
    this.target_skin_number = 0;
    const target = this.add.image(
      this.game.GW / 2,
      this.stick.y + this.stick.displayWidth / 2 + 150,
      "target_1"
    );

    const other_target = this.add.image(
      this.game.GW / 2,
      target.y,
      target.texture.key
    );

    helper.createButton(this, target.x - 100, target.y, "arrow-button", () => {
      if (!this.can_change) return;
      this.target_skin_number--;
      this.changeSkinButtonClicked(
        target,
        other_target,
        "targets",
        "+",
        this.target_skin_number
      );
    });

    helper
      .createButton(this, target.x + 100, target.y, "arrow-button", () => {
        if (!this.can_change) return;
        this.target_skin_number++;
        this.changeSkinButtonClicked(
          target,
          other_target,
          "targets",
          "-",
          this.target_skin_number
        );
      })
      .setFlipX(true);
  }

  createCircleSet() {
    this.circle_skin_number = 0;
    const circle = this.add.image(this.game.GW / 2, 200, "circle_1");
    this.circle = circle;

    const other_circle = this.add
      .image(circle.x, circle.y, circle.texture.key)
      .setAlpha(0);

    helper.createButton(this, circle.x - 100, circle.y, "arrow-button", () => {
      if (!this.can_change) return;

      this.circle_skin_number--;
      this.changeSkinButtonClicked(
        circle,
        other_circle,
        "circles",
        "+",
        this.circle_skin_number
      );
    });

    helper
      .createButton(this, circle.x + 100, circle.y, "arrow-button", () => {
        if (!this.can_change) return;

        this.circle_skin_number++;
        this.changeSkinButtonClicked(
          circle,
          other_circle,
          "circles",
          "-",
          this.circle_skin_number
        );
      })
      .setFlipX(true);
  }

  createPurchaseOffer(skin, callback) {
    const texture = skin.texture.key;

    const elements = [];
    elements.push(helper.createBackground(this, "black-bg"));

    const text = this.add
      .text(this.game.GW / 2, this.game.GH / 2 - 100, skin.cost, {
        font: "40px LuckiestGuy",
      })
      .setOrigin(0.5);

    elements.push(text);
    elements.push(
      this.add.image(text.x + text.displayWidth + 10, text.y, "coin")
    );
    elements.push(this.add.image(this.game.GW / 2, this.game.GH / 2, texture));

    const close_button = helper.createButton(
      this,
      this.game.GW / 2 + 100,
      this.game.GH / 2 + 100,
      "close-button",
      () => {
        elements.forEach((e) => e.destroy());
      }
    );
    elements.push(close_button);

    if (this.progress.money >= skin.cost) {
      elements.push(
        helper.createButton(
          this,
          this.game.GW / 2 - 100,
          this.game.GH / 2 + 100,
          "tick-button",
          () => {
            callback();
            elements.forEach((e) => e.destroy());
          }
        )
      );
    } else {
      close_button.x -= 100;
    }
  }
  purchaseCallback(skin, part) {
    skin.key.setAlpha(0);
    this.progress.skins[part].push(skin.texture.key);
  }
  changeSkinButtonClicked(sprite1, sprite2, part, sign, skin_number) {
    this.can_change = false;

    let shift = sign === "+" ? (shift = 1) : (shift = -1);

    if (sign === "-" && skin_number > this.setup[part].length - 1) {
      switch (part) {
        case "circles":
          this.circle_skin_number = 0;
          break;
        case "sticks":
          this.stick_skin_number = 0;
          break;
        case "targets":
          this.target_skin_number = 0;
          break;
      }
      skin_number = 0;
      shift = this.setup[part].length - 1;
    } else if (sign === "+" && skin_number < 0) {
      switch (part) {
        case "circles":
          this.circle_skin_number = this.setup[part].length - 1;
          break;
        case "sticks":
          this.stick_skin_number = this.setup[part].length - 1;
          break;
        case "targets":
          this.target_skin_number = this.setup[part].length - 1;
          break;
      }
      skin_number = this.setup[part].length - 1;
      shift = -(this.setup[part].length - 1);
    }

    const first_skin = this.setup[part][skin_number].skin;

    if (!sprite1.key) {
      sprite1.key = this.add.image(sprite1.x, sprite1.y, "lock").setAlpha(0);
    }

    sprite2.cost = this.setup[part][skin_number].cost;

    if (!sprite2.key) {
      sprite2.key = helper
        .createButton(this, sprite2.x, sprite2.y, "lock", () => {
          if (!this.can_change) return;
          if (sprite2.key.alpha != 0) {
            this.createPurchaseOffer(sprite2, () => {
              return this.purchaseCallback(sprite2, part);
            });
          }
        })
        .setAlpha(0);
    }

    if (!this.progress.skins[part].includes(first_skin)) {
      this.showItem(sprite2.key, sign);
    } else {
      sprite2.key.setAlpha(0);
    }

    if (
      !this.progress.skins[part].includes(this.setup[part][skin_number + shift].skin)
    ) {
      sprite1.key.setAlpha(1);
      this.hideItem(sprite1.key, sign);
    }

    sprite2.setTexture(first_skin);
    sprite1.setTexture(this.setup[part][skin_number + shift].skin);

    this.hideItem(sprite1, sign);
    this.showItem(sprite2, sign);
  }

  hideItem(item, direction) {
    let move_value = this.shift_value;
    direction === "+"
      ? (move_value = +this.shift_value)
      : (move_value = -this.shift_value);
    item.setScale(1).setAlpha(1);

    this.tweens.add({
      targets: item,
      duration: this.shift_duration,
      alpha: 0,
      scale: this.hidden_scale,
      x: `+=${move_value}`,
      onComplete: () => (item.x -= move_value),
    });
  }

  showItem(item, direction) {
    let move_value = this.shift_value;
    direction === "+"
      ? (move_value = -this.shift_value)
      : (move_value = this.shift_value);

    item.setScale(this.hidden_scale).setAlpha(0);

    item.x += move_value;

    this.tweens.add({
      targets: item,
      duration: this.shift_duration,
      alpha: 1,
      scale: 1,
      x: `${direction}=${this.shift_value}`,
      onComplete: () => (this.can_change = true),
    });
  }
}
