export default class PerfectManager {
  // also score manager
  constructor(scene) {
    this.scene = scene
  }
  createPerfectText() {
    this.perfect_text = this.scene.scene.add
      .image(this.scene.GW / 2, 150, "general-1", "perfect")
      .setAlpha(0)
      .setScale(0.5)
      .setDepth(1)
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
  handlePerfectCombo(combo){
    if(combo >= 3){
      if(combo >=5){
        this.perfect_text.setFrame("excellent")
        return this.scene.playSound("perfect_3")
      }
      this.perfect_text.setFrame("awesome")
     return this.scene.playSound("perfect_2")
    }
     
     this.scene.playSound("perfect_1")
     this.perfect_text.setFrame("perfect")
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
