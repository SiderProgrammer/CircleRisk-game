export default class {
  constructor(scene) {
    this.scene = scene
  }
  hideSetForAWhile() {
    this.scene.manager.circles.forEach((circle) => circle.setAlpha(0))
    this.scene.manager.stick.setAlpha(0)
    this.scene.time.addEvent({
      delay: 500,
      callback: this.showSet,
      callbackScope: this,
    })
  }

  showSet() {
    this.scene.manager.circles.forEach((circle) => circle.setAlpha(1))
    this.scene.manager.stick.setAlpha(1)
  }
}
