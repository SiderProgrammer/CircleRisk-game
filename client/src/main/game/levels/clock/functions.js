export default class {
  constructor(scene) {
    this.scene = scene
  }
  createTimerText() {
    this.time_left_text = this.scene.add
      .text(this.scene.game.GW / 2, 170, this.scene.time_left, {
        font: "100px LuckiestGuy",
      })
      .setOrigin(0.5, 0.5)
  }
  setTimer() {
    this.scene.timer = this.scene.time.addEvent({
      delay: 1000, // ms
      callback: () => this.timerTick(),
      repeat: this.scene.time_left,
    })
  }

  timerTick() {
    if (!this.scene.manager.game_started) return
    //console.log(this.scene.time_left)
    this.scene.time_left--
    if (this.scene.time_left === 0) {
      this.scene.timer.remove()
      this.scene.manager.gameOver()
    }
    this.time_left_text.setText(this.scene.time_left)
  }
}
