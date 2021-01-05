import { createButton } from "../GUI-helper"

export default class UI extends Phaser.Scene {
  constructor() {
    super("UI")
  }
  init({ context }) {
    this.managerContext = context
  }
  create() {
    const needed_score = this.add
      .text(
        this.managerContext.GW - 10,
        50,
        this.managerContext.scene.score_to_next_level, /// NEEDED SCORE
        {
          font: `40px ${main_font}`,
        }
      )
      .setOrigin(1, 0)
      .setDepth(1)

    const divider = this.add
      .text(
        needed_score.x - needed_score.displayWidth - 6,
        needed_score.y + needed_score.displayHeight / 2,
        "/",
        {
          font: `40px ${main_font}`, /// DIVIDER
        }
      )
      .setOrigin(1, 0.5)
      .setDepth(1)

    this.score_text = this.add
      .text(
        divider.x  - 26,
        divider.y - 20,
        this.getScoreText(),
        {
          font: `80px ${main_font}`,
        }
      )

      .setOrigin(1, 0.5)
      .setDepth(1)

divider.y -=10;
needed_score.y -=10;

    this.pause_button = createButton(
      this,
      10,
      10,
      "pause-button",
      () => {
        this.managerContext.scene.scene.pause()
        this.managerContext.scene.scene.launch("pause", {
          scene: this.managerContext.scene,
        })
        this.managerContext.scene.scene.bringToTop("pause")
       
      },
      "button"
    ).setOrigin(0)
  }
  getPauseButtonBounds() {
    return this.pause_button.getBounds()
  }
  updateScoreText() {
    this.score_text.setText(this.getScoreText())
  }
  getScoreText() {
    return this.managerContext.score //+ "/" + this.scene.scene.score_to_next_level
  }
}
