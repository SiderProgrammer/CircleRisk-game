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
    this.skin_change_tween = "Power1"
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
    this.arrows_shift = 135
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

    this.animateSetShow("circle", ease).then(() => {
      this.showTickAndMoney(this.circle.tick)
    })

    this.scene.time.addEvent({
      delay: 125,
      callback: () => {
        this.animateSetShow("stick", ease).then(() =>
          this.showTickAndMoney(this.stick.tick)
        )
      },
    })

    return new Promise((resolve) => {
      this.scene.time.addEvent({
        delay: 250,
        callback: async () => {
          await this.animateSetShow("target", ease).then(() =>
            this.showTickAndMoney(this.target.tick)
          )
          resolve()
        },
      })
    })
  }

  hide() {
    const ease = "Sine.easeIn"
    this.hideSkinsPrices()
    this.hideSkinsTicks()
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

  createPrices() {
    const x = this.calculatePriceBGX()

    this.circle.price = this.createSkinPrice(
      x,
      this.circle.y,
      this.getSkinFromSetup("circles", this.circle_skin_number).cost
    )
    this.circle.tick = this.createSkinTick(x, this.circle.y)
    this.updateTick(this.circle)

    this.stick.price = this.createSkinPrice(
      x,
      this.stick.y,
      this.getSkinFromSetup("sticks", this.stick_skin_number).cost
    )

    this.stick.tick = this.createSkinTick(x, this.stick.y)
    this.updateTick(this.stick)

    this.target.price = this.createSkinPrice(
      x,
      this.target.y,
      this.getSkinFromSetup("targets", this.target_skin_number).cost
    )

    this.target.tick = this.createSkinTick(x, this.target.y)
    this.updateTick(this.target)
  }

  createSkinTick(x, y) {
    return this.scene.add.image(x, y, "tick").setAlpha(0)
  }
  calculatePriceBGX() {
    return (
      this.scene.game.GW - (this.scene.game.GW - this.sets.circle[3].x) / 2 - 10
    ) // right arrow
  }
  createSkinPrice(x, y, price) {
    const text = this.scene.add
      .text(x, y - 5, price, {
        font: `60px ${main_font}`,
      })
      .setAlpha(0)
      .setOrigin(0.5, 0.5)

    text.bg = this.scene.add.image(x, y, "price-bg").setAlpha(0)
    text.bg.displayHeight = text.displayHeight + 20

    text.getCoinX = function () {
      return this.bg.x + this.bg.displayWidth / 2 + 10
    }

    text.coin = this.scene.add
      .image(text.getCoinX(), text.y + 5, "coin")
      .setAlpha(0)

    return text
  }

  updateSkinPrice(price_text, price) {
    price_text.setText(price)
    price_text.bg.displayWidth = price_text.displayWidth + 90
    price_text.x = price_text.bg.x
    price_text.coin.x = price_text.getCoinX()
  }

  updateTick(sprite) {
    sprite.price.bg.displayWidth = sprite.tick.displayWidth + 100
    sprite.tick.setPosition(sprite.price.bg.x, sprite.price.bg.y)
    sprite.price.coin.x = sprite.price.getCoinX()
  }

  hideSkinsPrices() {
    this.scene.tweens.add({
      targets: [
        this.target.price,
        this.target.price.coin,
        this.target.price.bg,

        this.stick.price,
        this.stick.price.coin,
        this.stick.price.bg,

        this.circle.price,
        this.circle.price.coin,
        this.circle.price.bg,
      ],
      alpha: 0,
      duration: 150,
    })
  }

  hideSkinsTicks() {
    this.scene.tweens.add({
      targets: [this.stick.tick, this.target.tick, this.circle.tick],
      alpha: 0,
      duration: 150,
    })
  }

  showTickAndMoney(tick) {
    this.scene.tweens.add({
      targets: [
        tick,
        this.circle.price.bg,
        this.circle.price.coin,
        this.stick.price.bg,
        this.stick.price.coin,
        this.target.price.bg,
        this.target.price.coin,
      ],
      alpha: 1,
      duration: 200,
    })
  }

  changeSkinsToEquiped() {
    this.circle.setTexture("circle_" + this.progress.current_skins["circles"])
    this.circle_skin_number = this.getSkinNumber(this.circle.texture.key)
    this.updateTick(this.circle)

    this.stick.setTexture("stick_" + this.progress.current_skins["sticks"])
    this.stick_skin_number = this.getSkinNumber(this.stick.texture.key)
    this.updateTick(this.stick)

    this.target.setTexture("target_" + this.progress.current_skins["targets"])
    this.target_skin_number = this.getSkinNumber(this.target.texture.key)
    this.updateTick(this.target)
  }

  createCircleSet(sprite) {
    this.circle_skin_number = this.getSkinNumber(sprite)
    const circle = this.scene.add.image(this.x, this.y, sprite).setDepth(1)
    this.circle = circle

    this.positions.circle = circle.y

    const other_circle = this.scene.add
      .image(circle.x, circle.y, circle.texture.key)
      .setAlpha(0)
      .setDepth(1)

    this.sets.circle.push(circle, other_circle)

    this.sets.circle.push(
      createButton(
        this.scene,
        circle.x - this.arrows_shift,
        circle.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return

          this.circle_skin_number--
          this.changeSkinButtonClicked(
            other_circle,
            this.circle,

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
        circle.x + this.arrows_shift,
        circle.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return

          this.circle_skin_number++
          this.changeSkinButtonClicked(
            other_circle,
            this.circle,

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
      .image(this.x, this.circle.y + this.circle.displayHeight / 2 - 5, sprite)
      .setAngle(90)
    stick.y += stick.displayWidth / 2
    this.stick = stick

    const other_stick = this.scene.add
      .image(stick.x, stick.y, stick.texture.key)
      .setAngle(90)

    other_stick.y += stick.displayWidth / 2

    this.sets.stick.push(stick, other_stick)

    this.sets.stick.push(
      createButton(
        this.scene,
        stick.x - this.arrows_shift,
        stick.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return
          this.stick_skin_number--
          this.changeSkinButtonClicked(
            other_stick,
            this.stick,
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
        stick.x + this.arrows_shift,
        stick.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return

          this.stick_skin_number++
          this.changeSkinButtonClicked(
            other_stick,
            this.stick,
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
    this.target = target

    const other_target = this.scene.add.image(
      target.x,
      target.y,
      target.texture.key
    )

    this.sets.target.push(target, other_target)

    this.sets.target.push(
      createButton(
        this.scene,
        target.x - this.arrows_shift,
        target.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return
          this.target_skin_number--
          this.changeSkinButtonClicked(
            other_target,
            this.target,
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
        target.x + this.arrows_shift,
        target.y,
        "arrow-button-blue",
        () => {
          if (!this.can_change) return
          this.target_skin_number++
          this.changeSkinButtonClicked(
            other_target,
            this.target,

            "targets",
            "-",
            this.target_skin_number
          )
        }
      ).setFlipX(true)
    )

    this.positions.target = target.y
  }

  getSkinFromSetup(part, skin_number) {
    return this.setup[part][skin_number]
  }
  isSkinUnlocked(part, skin) {
    return this.progress.skins[part].includes(skin)
  }
  changeSkinButtonClicked(sprite1, sprite2, part, sign, skin_number) {
    this.scene.hidePurchaseOffer()

    this.can_change = false

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

    const first_skin = this.getSkinFromSetup(part, skin_number).skin

    const second_skin = this.getSkinFromSetup(part, skin_number + shift).skin

    if (!sprite1.key) {
      sprite1.key = this.scene.add
        .image(sprite1.x, sprite1.y, "lock2")
        .setAlpha(0)
    }

    sprite2.cost = this.getSkinFromSetup(part, skin_number).cost

    if (!sprite2.key) {
      sprite2.key = createButton(
        this.scene,
        sprite2.x,
        sprite2.y,
        "lock2",
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

    this.updateSkinPrice(
      sprite2.price, // get part price context
      sprite2.cost
    )

    if (!this.isSkinUnlocked(part, first_skin)) {
      this.showItem(sprite2.key, sign)
      sprite2.key.setAlpha(1)
      sprite2.price.setAlpha(1)
      sprite2.tick.setAlpha(0)
    } else {
      sprite2.key.setAlpha(0)

      this.updateTick(sprite2)
      sprite2.tick.setAlpha(1)
      sprite2.price.setAlpha(0)
    }

    if (!this.isSkinUnlocked(part, second_skin)) {
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

    if (sprite2.key.alpha != 0) {
      this.scene.createPurchaseOffer(sprite2, (price) => {
        return this.scene.purchaseCallback(sprite2, part, price)
      })
    }

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
      ease: this.skin_change_tween,
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
      ease: this.skin_change_tween,
      targets: item,
      duration: this.shift_duration,
      alpha: 1,
      scale: 1,
      x: `${direction}=${this.shift_value}`,
      onComplete: () => (this.can_change = true),
    })
  }
}
