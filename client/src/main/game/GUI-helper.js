export const setGameSize = function (obj, scaleW = false, scaleH = false) {
  if (scaleW) {
    // i can also create image.setGameSize() method
    obj.displayWidth = obj.scene.game.GW
  }
  if (scaleH) {
    obj.displayHeight = obj.scene.game.GH
  }
  return obj
}

export const createBackground = function (scene, sprite, frame) {
  const background = scene.add.image(
    scene.game.GW / 2,
    scene.game.GH / 2,
    sprite,
    frame
  )

  setGameSize(background, true, true)
  return background
}

export const sceneTransition = function (scene, new_scene, data = {}) {
  scene.tweens.add({
    targets: createBackground(scene, "black-bg").setAlpha(0),
    alpha: 1,
    duration: 200,
    onComplete: () => scene.scene.start(new_scene, data),
  })
}
export const sceneIntro = function (scene) {
  let duration = 400
  if (scene.manager) {
    duration = scene.manager.intro_duration
  }

  scene.tweens.add({
    targets: createBackground(scene, "black-bg").setDepth(1),
    alpha: 0,
    duration: duration,
    // could pass intro duration as param but i did bad and i would had to change it in each leavl
  })
}

export const createButton = function (scene, x, y, sprite, func) {
  const button = scene.add
    .image(x, y,"buttons", sprite)
    .setInteractive()
    .on("pointerup", () => func())
  return button
}

export const createFetchingAnimation = function (scene, x, y) {
  const image = scene.add.image(x, y, "general-1","loading").setDepth(1000)

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
