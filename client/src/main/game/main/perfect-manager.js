export default class PerfectManager {
  // also score manager
  constructor(scene) {
    this.scene = scene
  }
  createPerfectText() {
    this.perfect_text = this.scene.scene.add
      .image(this.scene.GW / 2, 150, "perfect")
      .setAlpha(0)
      .setScale(0.5)
      .setDepth(1)
  }
  createScoreText() {
    const needed_score = this.scene.scene.add
      .text(
        this.scene.GW - 30,
        53,
        this.scene.scene.score_to_next_level, /// NEEDED SCORE
        {
          font: `50px ${main_font}`,
        }
      )
      .setOrigin(1, 0)
      .setDepth(1)

    const divider = this.scene.scene.add
      .text(
        needed_score.x - needed_score.displayWidth - 10,
        needed_score.y + needed_score.displayHeight / 2,
        "/",
        {
          font: `50px ${main_font}`, /// DIVIDER
        }
      )
      .setOrigin(1, 0.5)
      .setDepth(1)

    this.score_text = this.scene.scene.add
      .text(
        divider.x - divider.displayWidth - 10,
        divider.y - 22,
        this.getScoreText(),
        {
          font: `120px ${main_font}`,
        }
      )

      .setOrigin(1, 0.5)
      .setDepth(1)
  }
  updateScoreText() {
    this.score_text.setText(this.getScoreText())
  }
  getScoreText() {
    return this.scene.score //+ "/" + this.scene.scene.score_to_next_level
  }
  showPerfectText() {
    this.scene.scene.tweens.add({
      targets: this.perfect_text,
      scale: 1,
      alpha: 1,
      duration: 500,
      ease: "Bounce.easeOut",
      onComplete: () => this.perfect_text.setAlpha(0).setScale(0.5),
    })
  }
  showPerfectEffect() {
    this.stars_emtiter.explode(
      8,
      this.scene.circles[this.scene.current_circle].x,
      this.scene.circles[this.scene.current_circle].y
    )
  }
  createPerfectEmitter() {
    this.stars_emtiter = this.scene.scene.add
      .particles("stars")
      .setDepth(1)
      .createEmitter({
        frame: {
          frames: ["star_1", "star_2", "star_3", "star_4", "star_5"],
          cycle: false,
        },
        x: this.scene.circles[this.scene.current_circle].x,
        y: {
          min: this.scene.circles[this.scene.current_circle].y - 30,
          max: this.scene.circles[this.scene.current_circle].y + 30,
        },
        lifespan: 1500,
        speedX: { min: -200, max: 200 },
        scale: { start: 1, end: 0 },
        speedY: { min: 50, max: -200 },
        gravityY: 150,
        quantity: -1,
        //  angle: { min: 0, max: 360 },
        // maxParticles: 8,
        // reserve: 8,
        // tint: [0xffff00, 0xff0000, 0x00ff00, 0x0000ff],
      })
  }
}
