export const setGameSize = function (obj, scaleW = false, scaleH = false) {
  if (scaleW) {
    obj.displayWidth = obj.scene.game.GW
  }
  if (scaleH) {
    obj.displayHeight = obj.scene.game.GH
  }
}

export const createBackground = function (scene, sprite) {
  const background = scene.add.image(
    scene.game.GW / 2,
    scene.game.GH / 2,
    sprite
  )

  setGameSize(background, true, true)
  return background
}

export const sceneTransition = function (scene, new_scene, data = {}) {
  const shadow = createBackground(scene, "black-bg").setAlpha(0)

  scene.tweens.add({
    targets: shadow,
    alpha: 1,
    duration: 200,
    onComplete: () => scene.scene.start(new_scene, data),
  })
}
export const sceneIntro = function (scene) {
  const shadow = createBackground(scene, "black-bg")

  scene.tweens.add({
    targets: shadow,
    alpha: 0,
    duration: 400,
  })
}

export const createButton = function (scene, x, y, sprite, func) {
  const button = scene.add
    .image(x, y, sprite)
    .setInteractive()
    .on("pointerup", () => func())
  return button
}

export const createTopBar = function (scene, sprite) {
  const bar = scene.add.image(scene.game.GW / 2, 0, sprite)
  bar.setOrigin(0.5, 0)
  this.setGameSize(bar, true, false)
  return bar
}

export const createFetchingAnimation = function (scene, x, y) {
  const image = scene.add.image(x, y, "play-button").setDepth(1000)

  const tween = scene.tweens.add({
    targets: image,
    angle: 360,
    duration: 1000,
    repeat: -1,
  })

  return {
    stop: () => {
      tween.stop()
      image.destroy()
    },
  }
}
