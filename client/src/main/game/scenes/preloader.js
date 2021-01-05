import {INTERSTITIAL_AD_CONFIG,BANNER_AD_CONFIG} from "../../../config"

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

   
    admob.banner.config(BANNER_AD_CONFIG)
     
     admob.banner.prepare()


     admob.interstitial.config(INTERSTITIAL_AD_CONFIG)
     
     admob.interstitial.prepare()
    }
  
    this.scene.start("loader")
  }
}
