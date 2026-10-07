import scenes from "./scenes"

const targetWidth = 720
const targetHeight = 1280

// the layout is designed for portrait phones, so the height/width ratio is clamped:
// - below 16:9 (tablets, desktop, landscape) the game keeps 720x1280 and gets side bars
// - above 21:9 (foldable cover screens etc.) it stops growing and gets top/bottom bars
const MIN_RATIO = targetHeight / targetWidth
const MAX_RATIO = 21 / 9

const getDeviceRatio = () => window.innerHeight / window.innerWidth

// game width is static, game height follows the device ratio (within limits)
export const getGameSize = () => {
  const ratio = Phaser.Math.Clamp(getDeviceRatio(), MIN_RATIO, MAX_RATIO)

  return {
    width: targetWidth,
    height: Math.round(targetWidth * ratio),
  }
}

export default () => {
  const { width, height } = getGameSize()

  return {
    type: Phaser.CANVAS,
    width,
    height,
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
}
