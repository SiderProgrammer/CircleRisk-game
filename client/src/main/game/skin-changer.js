import { createButton } from "./GUI-helper"
import { EQUIP_SKIN } from "../shortcuts/requests"
import { saveProgress, getProgress } from "../shortcuts/save"

export default class {
  constructor(scene, x, y) {
    this.progress = scene.progress || getProgress()

    this.scene = scene
    this.setup = customize_skins_setup
    this.y = y
    this.x = x

    this.hidden_scale = 0.7
    this.shift_value = 90
    this.shift_duration = 200
    this.can_change = true

    this.positions = {
      circle: 0,
      stick: 0,
      target: 0,
    }

    this.sets = {
      circle: [],
      stick: [],
      target: [],
    }

    this.hidden_y = this.scene.game.GH + 200
  }

  getSkinNumber(sprite) {
    return Number(sprite.split("_")[1]) - 1
  }

  save() {
    saveProgress(this.progress)
    EQUIP_SKIN({
      current_skins: this.progress.current_skins,
      nickname: this.progress.nickname,
    })
  }

  show() {
    const ease = "Sine"

    this.animateSetShow("circle", ease).then(() =>
      this.showSkinPrice(this.scene.circle_price)
    )

    this.scene.time.addEvent({
      delay: 125,
      callback: () => {
        this.animateSetShow("stick", ease).then(() =>
          this.showSkinPrice(this.scene.stick_price)
        )
      },
    })

    return new Promise((resolve) => {
      this.scene.time.addEvent({
        delay: 250,
        callback: async () => {
          await this.animateSetShow("target", ease).then(() =>
            this.showSkinPrice(this.scene.target_price)
          )
          resolve()
        },
      })
    })
  }

  hide() {
    const ease = "Sine.easeIn"
    this.hideSkinsPrices()

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: [...this.sets.circle, ...this.sets.stick, ...this.sets.target],
        ease: ease,
        y: `+=${this.scene.game.GH}`,
        duration: 200,

        onComplete: () => resolve(),
      })
    })
  }

  animateSetShow(set, ease) {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.sets[set],
        y: this.positions[set],
        duration: 250,
        ease: ease,
        onComplete: () => resolve(),
      })
    })
  }

  hideSetsWithoutAnimation() {
    for (const set in this.sets) {
      this.sets[set].forEach((e) => (e.y += this.scene.game.GH))
    }
  }

  createSkinPrice(x, y, price) {
    const text = this.scene.add
      .text(x + 160, y, price, {
        font: `70px ${main_font}`,
      })
      .setOrigin(0, 0.5)
      .setAlpha(0)

    text.getCoinX = function () {
      return this.x + this.displayWidth + 20
    }

    text.coin = this.scene.add
      .image(text.getCoinX(), text.y, "coin")
      .setOrigin(0, 0.5)
      .setAlpha(0)

    return text
  }

  updateSkinPrice(price_text, price) {
    price_text.setText(price)
    price_text.coin.x = price_text.getCoinX()
  }
  showSkinPrice(price) {
    this.scene.tweens.add({
      targets: [price, price.coin],
      alpha: 1,
      duration: 200,
    })
  }

  hideSkinsPrices() {
    this.scene.tweens.add({
      targets: [
        this.scene.target_price,
        this.scene.target_price.coin,
        this.scene.stick_price,
        this.scene.stick_price.coin,
        this.scene.circle_price,
        this.scene.circle_price.coin,
      ],
      alpha: 0,
      duration: 150,
    })
  }

  createCircleSet(sprite) {
    this.circle_skin_number = this.getSkinNumber(sprite)
    const circle = this.scene.add.image(this.x, this.y, sprite)
    this.circle = circle

    circle.cost = this.getSpriteFromSetup(
      "circles",
      this.circle_skin_number
    ).cost

    this.positions.circle = circle.y

    const other_circle = this.scene.add
      .image(circle.x, circle.y, circle.texture.key)
      .setAlpha(0)

    this.sets.circle.push(circle, other_circle)

    this.sets.circle.push(
      createButton(
        this.scene,
        circle.x - 100,
        circle.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return

          this.circle_skin_number--
          this.changeSkinButtonClicked(
            circle,
            other_circle,
            "circles",
            "+",
            this.circle_skin_number
          )
        }
      )
    )

    this.sets.circle.push(
      createButton(
        this.scene,
        circle.x + 100,
        circle.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return

          this.circle_skin_number++
          this.changeSkinButtonClicked(
            circle,
            other_circle,
            "circles",
            "-",
            this.circle_skin_number
          )
        }
      ).setFlipX(true)
    )
  }
  createStickSet(sprite) {
    this.stick_skin_number = this.getSkinNumber(sprite)

    const stick = this.scene.add
      .image(this.x, this.circle.y + this.circle.displayHeight / 2, sprite)
      .setAngle(90)

    this.stick = stick

    stick.cost = this.getSpriteFromSetup("sticks", this.stick_skin_number).cost

    const other_stick = this.scene.add
      .image(stick.x, stick.y, stick.texture.key)
      .setAngle(90)

    stick.y += stick.displayWidth / 2
    other_stick.y += stick.displayWidth / 2

    this.sets.stick.push(stick, other_stick)

    this.sets.stick.push(
      createButton(
        this.scene,
        stick.x - 100,
        stick.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return
          this.stick_skin_number--
          this.changeSkinButtonClicked(
            stick,
            other_stick,
            "sticks",
            "+",
            this.stick_skin_number
          )
        }
      )
    )

    this.sets.stick.push(
      createButton(
        this.scene,
        stick.x + 100,
        stick.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return

          this.stick_skin_number++
          this.changeSkinButtonClicked(
            stick,
            other_stick,
            "sticks",
            "-",
            this.stick_skin_number
          )
        }
      ).setFlipX(true)
    )

    this.positions.stick = this.stick.y
  }

  createTargetSet(sprite) {
    this.target_skin_number = this.getSkinNumber(sprite)

    const target = this.scene.add.image(
      this.x,
      this.stick.y + this.stick.displayWidth / 2 + 150,
      sprite
    )

    target.cost = this.getSpriteFromSetup(
      "targets",
      this.target_skin_number
    ).cost

    const other_target = this.scene.add.image(
      target.x,
      target.y,
      target.texture.key
    )

    this.sets.target.push(target, other_target)

    this.sets.target.push(
      createButton(
        this.scene,
        target.x - 100,
        target.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return
          this.target_skin_number--
          this.changeSkinButtonClicked(
            target,
            other_target,
            "targets",
            "+",
            this.target_skin_number
          )
        }
      )
    )

    this.sets.target.push(
      createButton(
        this.scene,
        target.x + 100,
        target.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return
          this.target_skin_number++
          this.changeSkinButtonClicked(
            target,
            other_target,
            "targets",
            "-",
            this.target_skin_number
          )
        }
      ).setFlipX(true)
    )

    this.positions.target = target.y
  }

  getSpriteFromSetup(part, skin_number) {
    return this.setup[part][skin_number]
  }

  changeSkinButtonClicked(sprite1, sprite2, part, sign, skin_number) {
    this.can_change = false
    let price_to_update = {}

    let shift = sign === "+" ? (shift = 1) : (shift = -1)

    if (sign === "-" && skin_number > this.setup[part].length - 1) {
      switch (part) {
        case "circles":
          this.circle_skin_number = 0
          break
        case "sticks":
          this.stick_skin_number = 0
          break
        case "targets":
          this.target_skin_number = 0
          break
      }

      skin_number = 0
      shift = this.setup[part].length - 1
    } else if (sign === "+" && skin_number < 0) {
      switch (part) {
        case "circles":
          this.circle_skin_number = this.setup[part].length - 1
          break
        case "sticks":
          this.stick_skin_number = this.setup[part].length - 1
          break
        case "targets":
          this.target_skin_number = this.setup[part].length - 1
          break
      }
      skin_number = this.setup[part].length - 1
      shift = -(this.setup[part].length - 1)
    }

    const first_skin = this.getSpriteFromSetup(part, skin_number).skin

    const second_skin = this.getSpriteFromSetup(part, skin_number + shift).skin

    if (!sprite1.key) {
      sprite1.key = this.scene.add
        .image(sprite1.x, sprite1.y, "lock")
        .setAlpha(0)
    }

    sprite2.cost = this.getSpriteFromSetup(part, skin_number).cost

    if (!sprite2.key) {
      sprite2.key = createButton(
        this.scene,
        sprite2.x,
        sprite2.y,
        "lock",
        () => {
          if (!this.can_change) return
          if (sprite2.key.alpha != 0) {
            this.scene.createPurchaseOffer(sprite2, (price) => {
              return this.scene.purchaseCallback(sprite2, part, price)
            })
          }
        }
      ).setAlpha(0)
    }

    if (!this.progress.skins[part].includes(first_skin)) {
      this.showItem(sprite2.key, sign)
    } else {
      sprite2.key.setAlpha(0)
    }

    if (!this.progress.skins[part].includes(second_skin)) {
      sprite1.key.setAlpha(1)
      this.hideItem(sprite1.key, sign)
    }

    sprite2.setTexture(first_skin)
    sprite1.setTexture(second_skin)

    const available_part_skins = this.progress.skins[part].map(
      (skin) => this.getSkinNumber(skin) + 1
    )

    if (available_part_skins.includes(skin_number + 1)) {
      this.progress.current_skins[part] = skin_number + 1
    }

    this.updateSkinPrice(
      eval(`this.scene.${part.slice(0, -1)}_price`), // get part price context
      sprite2.cost
    )

    this.hideItem(sprite1, sign)
    this.showItem(sprite2, sign)
  }

  hideItem(item, direction) {
    let move_value = this.shift_value
    direction === "+"
      ? (move_value = +this.shift_value)
      : (move_value = -this.shift_value)
    item.setScale(1).setAlpha(1)

    this.scene.tweens.add({
      targets: item,
      duration: this.shift_duration,
      alpha: 0,
      scale: this.hidden_scale,
      x: `+=${move_value}`,
      onComplete: () => (item.x -= move_value),
    })
  }
  showItem(item, direction) {
    let move_value = this.shift_value
    direction === "+"
      ? (move_value = -this.shift_value)
      : (move_value = this.shift_value)

    item.setScale(this.hidden_scale).setAlpha(0)

    item.x += move_value

    this.scene.tweens.add({
      targets: item,
      duration: this.shift_duration,
      alpha: 1,
      scale: 1,
      x: `${direction}=${this.shift_value}`,
      onComplete: () => (this.can_change = true),
    })
  }
}
