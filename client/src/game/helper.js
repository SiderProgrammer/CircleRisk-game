export default {
  setGameSize: function (obj, scaleW = false, scaleH = false) {
    if (scaleW) {
      obj.displayWidth = obj.scene.game.GW;
    }
    if (scaleH) {
      obj.displayHeight = obj.scene.game.GH;
    }
  },

  createBackground: function (scene, sprite) {
    const background = scene.add.image(
      scene.game.GW / 2,
      scene.game.GH / 2,
      sprite
    );

    this.setGameSize(background, true, true);
    return background;
  },

  sceneTransition: function (scene, new_scene,data = {}) {
    const shadow = scene.add
      .image(scene.game.GW / 2, scene.game.GH / 2, "black-bg")
      .setAlpha(0);
    scene.tweens.add({
      targets: shadow,
      alpha: 1,
      duration: 200,
      onComplete: () => scene.scene.start(new_scene,data),
    });
  },
  sceneIntro: function (scene) {
    const shadow = scene.add.image(
      scene.game.GW / 2,
      scene.game.GH / 2,
      "black-bg"
    );

    scene.tweens.add({
      targets: shadow,
      alpha: 0,
      duration: 400,
    });
  },

  createButton: function (scene, x, y, sprite, func) {
    const button = scene.add
      .image(x, y, sprite)
      .setInteractive()
      .on("pointerup", () => func());
    return button;
  },

  createTopBar: function (scene, sprite) {
    const bar = scene.add.image(scene.game.GW / 2, 0, sprite);
    bar.setOrigin(0.5, 0);
    this.setGameSize(bar, true, false);
    return bar;
  },
};
