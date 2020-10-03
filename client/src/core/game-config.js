import scenes from "./scenes"

const targetWidth = 480
const targetHeight = 854

const deviceRatio = window.innerHeight / window.innerWidth

const newRatio = (targetWidth / targetHeight) * deviceRatio

const gameWidth = targetWidth
const gameHeight = targetHeight * newRatio

// game width is static,game height is dynamic

export default {
  type: Phaser.WEBGL,
  width: gameWidth,
  height: gameHeight,
  enableDebug: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  render: {
    clearBeforeRender: false,
  },

  scene: scenes,
}
