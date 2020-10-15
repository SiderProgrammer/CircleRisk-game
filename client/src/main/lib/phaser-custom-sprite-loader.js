/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

require("phaser/src/polyfills");

var CONST = require("phaser/src/const");
var Extend = require("phaser/src/utils/object/Extend");

/**
 * @namespace Phaser
 */

var Phaser = {
  Cameras: {
    Scene2D: require("phaser/src/cameras/2d"),
  },
  Events: require("phaser/src/events/EventEmitter"),
  Game: require("phaser/src/core/Game"),
  GameObjects: {
    DisplayList: require("phaser/src/gameobjects/DisplayList"),
    UpdateList: require("phaser/src/gameobjects/UpdateList"),

    Image: require("phaser/src/gameobjects/image/Image"),
    Sprite: require("phaser/src/gameobjects/sprite/Sprite"),

    Factories: {
      Image: require("phaser/src/gameobjects/image/ImageFactory"),
      Sprite: require("phaser/src/gameobjects/sprite/SpriteFactory"),
    },

    Creators: {
      Image: require("phaser/src/gameobjects/image/ImageCreator"),
      Sprite: require("phaser/src/gameobjects/sprite/SpriteCreator"),
    },
  },
  Loader: {
    FileTypes: {
      ImageFile: require("phaser/src/loader/filetypes/ImageFile"),
    },
    LoaderPlugin: require("phaser/src/loader/LoaderPlugin"),
  },
  Math: {
    Between: require("phaser/src/math/Between"),
  },
  Tweens: require("phaser/src/tweens"),
};

//  Merge in the consts

Phaser = Extend(false, Phaser, CONST);

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;
