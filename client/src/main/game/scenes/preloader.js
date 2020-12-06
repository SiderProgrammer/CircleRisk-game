const imgPath = "./assets/img"

export default class preloader extends Phaser.Scene {
  constructor() {
    super("preloader")
  }

  loadImage(name, path) {
    this.load.image(name, `${imgPath}/${path}/${name}.png`)
  }
  loadAtlas(name) {
    this.load.atlas(
      `${name}`,
      `${imgPath}/${name}.png`,
      `${imgPath}/${name}.json`
    )
  }

  preload() {
    this.loadAtlas("general-1")
    this.loadImage("loading-bg", "backgrounds")
  }
  create() {
    this.scene.start("loader")
  }
}
