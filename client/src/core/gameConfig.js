import scenes from "./scenes"

const targetWidth = 480
const targetHeight = 854

const deviceRatio = window.innerWidth / window.innerHeight

const newRatio = (targetHeight / targetWidth) * deviceRatio

const gameWidth = targetWidth * newRatio
const gameHeight = targetHeight

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
