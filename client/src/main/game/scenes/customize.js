import * as helper from "../GUI-helper"
import { CREATE_FETCH_ERROR } from "../../fetch-helper"
import { saveProgress, getProgress } from "../../shortcuts/save"
import { SAVE_MONEY, SAVE_NEW_SKIN } from "../../shortcuts/requests"
import { START_FETCHING_SCENE, STOP_FETCHING_SCENE } from "../../fetch-helper"
import SkinChangerManager from "../skin-changer"

export default class Customize extends Phaser.Scene {
  constructor() {
    super("customize")
  }

  init() {
    this.progress = getProgress()
    this.purchase_offer_elements = []
  }

  create() {
    this.skinChangerManager = new SkinChangerManager(
      this,
      this.game.GW / 2 - 150,
      200
    )
    this.createMoney()
    this.createHomeButton()
    this.createBackButton()
    this.createSkinChanger()

    this.skinChangerManager.hideSetsWithoutAnimation()

    this.events.on("wake", () => {
      this.progress.money = getProgress().money
      this.money_text.setText(this.progress.money)
    })
  }

  async animateCustomizeShow(button = "home", scenes_to_wake = []) {
    this.showMoney()
    await this.skinChangerManager.show()

    button === "home" && this.showHomeButton()
    button === "back" && this.showBackButton()
    this.scenes_to_wake = scenes_to_wake
  }

  async animateCustomizeHide() {
    this.hideMoney()
    this.hideHomeButton()
    this.hideBackButton()

    await this.skinChangerManager.hide()

    //  return new Promise((resolve) => resolve())
  }

  createSkinChanger() {
    this.skinChangerManager.createCircleSet(
      "circle_" + this.progress.current_skins["circles"]
    )
    this.skinChangerManager.createStickSet(
      "stick_" + this.progress.current_skins["sticks"]
    )
    this.skinChangerManager.createTargetSet(
      "target_" + this.progress.current_skins["targets"]
    )

    this.skinChangerManager.createPrices()
  }

  hideHomeButton() {
    this.hideButtonTween(this.home_button)
  }

  hideBackButton() {
    this.hideButtonTween(this.back_button)
  }

  hideButtonTween(button) {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: button,
        ease: "Sine.easeIn",
        y: `+=${this.game.GH}`,
        duration: 200,
        onComplete: () => resolve(),
      })
    })
  }
  hideMoney() {
    this.tweens.add({
      targets: [this.coin, this.money_text],
      alpha: 0,
      duration: 250,
    })
  }
  showHomeButton() {
    this.showButtonTween(this.home_button)
  }

  showBackButton() {
    this.showButtonTween(this.back_button)
  }

  showButtonTween(button) {
    this.tweens.add({
      targets: button,
      duration: 250,
      ease: "Sine",
      y: this.game.GH - 20,
    })
  }

  createHomeButton() {
    this.home_button = helper
      .createButton(
        this,
        this.game.GW / 2,
        this.game.GH,
        "home-button",
        async () => {
          this.skinChangerManager.save()
          this.hidePurchaseOffer()

          await this.animateCustomizeHide()
          this.home_button.resetPosition()
          this.back_button.resetPosition()
          this.scene.get("menu").animateShowMenu()
          this.scene.sleep()
          this.skinChangerManager.changeSkinsToEquiped()

          // maybe stop customize scene
        }
      )
      .setOrigin(0.5, 1)

    this.home_button.y += this.home_button.displayHeight

    const hidden_y = this.home_button.y

    this.home_button.resetPosition = function () {
      this.y = hidden_y
    }
  }

  createBackButton() {
    this.back_button = helper
      .createButton(
        this,
        this.game.GW / 2,
        this.game.GH,
        "back-button",
        async () => {
          this.skinChangerManager.save()
          this.hidePurchaseOffer()

          await this.animateCustomizeHide()
          this.back_button.resetPosition()
          this.home_button.resetPosition()
          this.scenes_to_wake.forEach((s) => s.wake())
          this.scene.wake("lose")
          this.scene.sleep("menu")
          //  this.scene.get("menu").animateShowMenu()
          this.scene.sleep()
          this.skinChangerManager.changeSkinsToEquiped()
        }
      )
      .setOrigin(0.5, 1)

    this.back_button.y += this.back_button.displayHeight

    const hidden_y = this.back_button.y

    this.back_button.resetPosition = function () {
      this.y = hidden_y
    }
  }

  createMoney() {
    this.coin = this.add
      .image(this.game.GW - 10, 10, "coin")
      .setOrigin(1, 0)
      .setAlpha(0)

    this.money_text = this.add
      .text(
        this.coin.x - this.coin.displayWidth - 20,
        this.coin.y,
        this.progress.money,
        {
          font: `70px ${main_font}`,
        }
      )
      .setOrigin(1, 0)
      .setAlpha(0)
  }

  showMoney() {
    this.coin.setAlpha(0)
    this.money_text.setAlpha(0)

    this.tweens.add({
      targets: [this.coin, this.money_text],
      duration: 250,
      alpha: 1,
    })
  }

  getPurchaseItemsY() {
    let y = this.back_button.y
    if (this.home_button.y < y) y = this.home_button.y

    return (
      this.skinChangerManager.target.price.y +
      (y - this.skinChangerManager.target.price.y) / 2 -
      40
    )
  }
  hidePurchaseOffer() {
    if (this.purchase_offer_elements.length > 0) {
      this.purchase_offer_elements.forEach((e) => e.destroy())
      this.purchase_offer_elements.length = 0
    }
  }
  createPurchaseOffer(skin, callback) {
    this.can_change = false
    const texture = skin.texture.key

    this.hidePurchaseOffer()

    const y = this.getPurchaseItemsY()

    this.purchase_offer_elements.push(
      this.add.image(this.game.GW / 2, y, texture)
    )

    const close_button = helper.createButton(
      this,
      this.game.GW / 2 + 100,
      y + 80,
      "close-button",
      () => {
        this.hidePurchaseOffer()
        this.can_change = true
      }
    )
    this.purchase_offer_elements.push(close_button)

    if (this.progress.money >= skin.cost) {
      this.purchase_offer_elements.push(
        helper.createButton(
          this,
          this.game.GW / 2 - 100,
          y + 80,
          "tick-button",
          () => {
            callback(skin.cost)

            this.can_change = true
          }
        )
      )
    } else {
      close_button.x -= 100
    }
  }
  async purchaseCallback(skin, part, price) {
    const GET_NUMBERS_REGEXP = new RegExp(/^\D+/g, "g")
    START_FETCHING_SCENE(this)

    try {
      const response = await SAVE_NEW_SKIN({
        skin: [part, skin.texture.key.replace(GET_NUMBERS_REGEXP, "")],
        nickname: this.progress.nickname,
      })

      if (response.ok) {
        this.game.audio.sounds.buy_sound.play()
        this.hidePurchaseOffer()
        skin.tick.setAlpha(1)
        skin.price.setAlpha(0)
        skin.key.setAlpha(0)

        this.progress.skins[part].push(skin.texture.key)
        this.progress.money -= price
        this.money_text.setText(this.progress.money)
        this.progress.current_skins[part] =
          this.skinChangerManager.getSkinNumber(skin.texture.key) + 1 // set new skin
        this.skinChangerManager.updateTick(skin)

        SAVE_MONEY({
          money: this.progress.money,
          nickname: this.progress.nickname,
        })

        saveProgress(this.progress)
      }
    } catch {
      // CREATE_FETCH_ERROR(this, this.game.GW / 2, this.game.GH / 2 - 300)
    } finally {
      STOP_FETCHING_SCENE(this)
    }
  }
}
