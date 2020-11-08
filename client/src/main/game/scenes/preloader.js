const imgPath = "./assets/img"

export default class preloader extends Phaser.Scene {
  constructor() {
    super("preloader")
  }

  loadImage(name, path) {
    this.load.image(name, `${imgPath}/${path}/${name}.png`)
  }

  preload() {
    this.loadImage("loading-bar", "mix")
    this.loadImage("loading-circle-arm", "mix")
    this.loadImage("pipcompany", "mix")
    this.loadImage("gentelman", "mix")
    this.loadImage("loading-bg", "backgrounds")
  }
  create() {
    this.scene.start("loader")
  }
}
