import { createButton } from "../GUI-helper"

export default class UI extends Phaser.Scene {
  constructor() {
    super("UI")
  }
  init({ context }) {
    this.managerContext = context
  }
  create() {
    // the scene instance outlives its game objects, and the next level's manager reads
    // these before a relaunched UI scene has run create
    this.events.once("shutdown", () => {
      this.score_text = null
      this.opponent_score_text = null
      this.pause_button = null
    })

    if (this.managerContext.multiplayer) return this.createMultiplayerUI()

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
  // no pause in multiplayer (the opponent keeps playing), show both scores instead
  createMultiplayerUI() {
    const opponent = this.managerContext.multiplayer.opponent || {}

    this.add
      .text(20, 20, "YOU", { font: `32px ${main_font}` })
      .setOrigin(0, 0)
    this.score_text = this.add
      .text(20, 55, this.getScoreText(), { font: `80px ${main_font}` })
      .setOrigin(0, 0)

    this.add
      .text(this.managerContext.GW - 20, 20, opponent.nickname || "OPPONENT", {
        font: `32px ${main_font}`,
        color: "#bbbbbb",
      })
      .setOrigin(1, 0)
    this.opponent_score_text = this.add
      .text(this.managerContext.GW - 20, 55, 0, {
        font: `80px ${main_font}`,
        color: "#bbbbbb",
      })
      .setOrigin(1, 0)

    const { win_score } = this.managerContext.multiplayer.match.config
    if (win_score)
      this.add
        .text(this.managerContext.GW / 2, 40, `FIRST TO ${win_score}`, { font: `34px ${main_font}` })
        .setOrigin(0.5, 0)
  }
  updateOpponentScoreText(score) {
    this.opponent_score_text && this.opponent_score_text.setText(score)
  }
  getPauseButtonBounds() {
    if (!this.pause_button) return new Phaser.Geom.Rectangle(0, 0, 0, 0)
    return this.pause_button.getBounds()
  }
  updateScoreText() {
    this.score_text.setText(this.getScoreText())
  }
  getScoreText() {
    return this.managerContext.score //+ "/" + this.scene.scene.score_to_next_level
  }
}
