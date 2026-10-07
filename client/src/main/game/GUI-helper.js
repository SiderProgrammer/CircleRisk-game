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
const bg = createBackground(scene, "black-bg").setDepth(1)
  scene.tweens.add({
    targets: bg,
    alpha: 0,
    duration: duration,
    onComplete:()=>bg.destroy()
    // could pass intro duration as param but i did bad and i would had to change it in each leavl
  })
}

export const createButton = function (scene, x, y, sprite, func, sound) {
  const button = scene.add
    .image(x, y, "buttons", sprite)
    .setInteractive()
    .on("pointerup", () => {
      sound && scene.game.audio.sounds[sound].play()
      func()
    })
  return button
}

export const createFetchingAnimation = function (scene, x, y) {
  const image = scene.add.image(x, y, "general-1", "loading").setDepth(1000)

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

export const createTextButton = function (
  scene,
  x,
  y,
  label,
  func,
  { width = 460, height = 110, color = 0x2e86de, font_size = 50 } = {}
) {
  const background = scene.add.graphics()
  const text = scene.add
    .text(0, 0, label, { font: `${font_size}px ${main_font}` })
    .setOrigin(0.5)

  const button = scene.add.container(x, y, [background, text])
  button.text = text
  button.drawBackground = (fill) => {
    background.clear()
    background.fillStyle(0x000000, 0.35)
    background.fillRoundedRect(-width / 2, -height / 2 + 8, width, height, 30)
    background.fillStyle(fill, 1)
    background.fillRoundedRect(-width / 2, -height / 2, width, height, 30)
  }
  button.drawBackground(color)
  button.setColor = (new_color) => {
    color = new_color
    button.drawBackground(color)
    return button
  }

  button
    .setSize(width, height)
    .setInteractive()
    .on("pointerdown", () => button.setScale(0.95))
    .on("pointerout", () => button.setScale(1))
    .on("pointerup", () => {
      button.setScale(1)
      scene.game.audio.sounds.button && scene.game.audio.sounds.button.play()
      func()
    })

  return button
}
