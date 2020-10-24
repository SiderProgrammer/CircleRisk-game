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
  }

  create() {
    this.skinChangerManager = new SkinChangerManager(
      this,
      this.game.GH / 2 - 50
    )

    //this.createHomeButton()
    this.createCoin()
    this.createMoney()
    this.showSkinChanger()

    // helper.sceneIntro(this)
  }

  showSkinChanger() {
    this.skinChangerManager.createCircleSet(
      "circle_" + this.progress.current_skins["circles"]
    ) //number of current skin
    this.skinChangerManager.createStickSet(
      "stick_" + this.progress.current_skins["sticks"]
    ) //number of current skin
    this.skinChangerManager.createTargetSet(
      "target_" + this.progress.current_skins["targets"]
    ) //number of current skin
    this.skinChangerManager.show()
  }
  createHomeButton() {
    this.home_button = helper
      .createButton(this, this.game.GW, 10, "home-button", () => {
        this.skinChangerManager.save()
        this.scene.start("menu")
      })
      .setOrigin(0)
  }

  createCoin() {
    this.coin = this.add.image(this.game.GW - 10, 10, "coin").setOrigin(1, 0)
  }

  createMoney() {
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
  }

  createPurchaseOffer(skin, callback) {
    this.can_change = false
    const texture = skin.texture.key

    const elements = []
    elements.push(helper.createBackground(this, "black-bg"))

    const text = this.add
      .text(this.game.GW / 2, this.game.GH / 2 - 100, skin.cost, {
        font: `70px ${main_font}`,
      })
      .setOrigin(0.5)

    text.x -= text.displayWidth / 2
    const coin = this.add
      .image(text.x + text.displayWidth / 2 + 20, text.y, "coin")
      .setOrigin(0, 0.5)

    elements.push(text, coin)
    elements.push(this.add.image(this.game.GW / 2, this.game.GH / 2, texture))

    const close_button = helper.createButton(
      this,
      this.game.GW / 2 + 100,
      this.game.GH / 2 + 100,
      "close-button",
      () => {
        elements.forEach((e) => e.destroy())
        this.can_change = true
      }
    )
    elements.push(close_button)

    if (this.progress.money >= skin.cost) {
      elements.push(
        helper.createButton(
          this,
          this.game.GW / 2 - 100,
          this.game.GH / 2 + 100,
          "tick-button",
          () => {
            callback(skin.cost)
            elements.forEach((e) => e.destroy())
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
        skin.key.setAlpha(0)
        this.progress.skins[part].push(skin.texture.key)
        this.progress.money -= price
        this.money_text.setText(this.progress.money)
        this.progress.current_skins[part] =
          this.skinChangerManager.getSkinNumber(skin.texture.key) + 1 // set new skin

        SAVE_MONEY({
          money: this.progress.money,
          nickname: this.progress.nickname,
        })

        saveProgress(this.progress)
      }
    } catch {
      CREATE_FETCH_ERROR(this, this.game.GW / 2, this.game.GH / 2 - 300)
    } finally {
      STOP_FETCHING_SCENE(this)
    }
  }
}
