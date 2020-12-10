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
   if(window.admob){

    const config = {
      isTesting:true,
      autoShow:false,
    }
    admob.banner.config({
     ...config,
      id: 'ca-app-pub-3940256099942544/6300978111',
     })
     
     admob.banner.prepare()


     admob.interstitial.config({
      id: 'ca-app-pub-3940256099942544/1033173712',
      ...config
     })
     
     admob.interstitial.prepare()
    }
  
    this.scene.start("loader")
  }
}
