const config = require("./constants")

module.exports = [
  {
    color: "purple_1",
    info: {
      score_to_next_level: 10,

      name: "basic",
    },
    config: {
      background: "basic-bg",
      ...config,
    },
  },

  {
    color: "red_3",
    info: {
      score_to_next_level: 10,
      tint: "0x06E0FF",
      name: "carousel",
    },
    config: {
      background: "carousel-bg",
      ...config,
      targets_speed: 1,
    },
  },

  

  {
    color: "gray_1",
    info: {
      score_to_next_level: 10,

      name: "night",
    },
    config: {
      background: "night-bg",
      ...config,
    },
  },

  {
    color: "green_7",
    info: {
      score_to_next_level: 15,
      tint: "0x06E0FF",
      name: "pulsate",
    },
    config: {
      background: "pulsate-bg",
      ...config,
     
    },
  },

  {
    color: "purple_5",
    info: {
      score_to_next_level: 20,
      tint: "0x06E0FF",
      name: "oneStep",
    },
    config: {
      background: "oneStep-bg",
      ...config,
      acceleration: 0.12,
    },
  },
  {
    color: "orange_1",
    info: {
      score_to_next_level: 25,

      name: "wind",
    },
    config: {
      background: "autumn-bg",
      ...config,
      targets_speed: 1.6,

      acceleration: 0.04,
    },
  },

  {
    color: "white_1",
    info: {
      score_to_next_level: 80,
      tint: "0x06E0FF",
      name: "threeTargets-",
    },
    config: {
      background: "carousel-bg",
      ...config,
    targets_amount:3,
    ball_distance:450,
    starting_target:0,
  additional_angle:30,
  rotation_speed:1.2
    },
  },

  {
    color: "yellow_4",
    info: {
      score_to_next_level: 20,
      tint: "0x06E0FF",
      name: "twins",
    },
    config: {
      background: "twins-bg",
      ...config,
      rotation_speed: 1.25,
    },
  },

  {
    color: "yellow_3",
    info: {
      score_to_next_level: 25,
      tint: "0x06E0FF",
      name: "tiny",
    },
    config: {
      background: "tiny-bg",
      ...config,
      rotation_speed: 1,
      acceleration: 0.03,
    },
  },

  {
    color: "brown_4",
    info: {
      score_to_next_level: 30,
      tint: "0x06E0FF",
      name: "unstable",
    },
    config: {
      background: "unstable-bg",

      rotation_speed_change: {
        min: 0.7,
        max: 2.5,
      },
      ...config,
    },
  },

  {
    color: "green_3",
    info: {
      score_to_next_level: 30,
      tint: "0xFFF000",
      name: "reverse",
    },
    config: {
      background: "reverse-bg",
      ...config,
      starting_target: 6,
      rotation_speed: 1.1,
      acceleration: 0.035,
    },
  },

  {
    color: "green_6",
    info: {
      score_to_next_level: 25,
      tint: "0x06E0FF",
      name: "expand",
    },
    config: {
      background: "star-bg",
      ...config,
      ball_distance: 116,
      rotation_speed: 1.15,
      acceleration: 0.035,
    },
  },

  {
    color: "blue_2",
    info: {
      score_to_next_level: 30,
      tint: "0x0000FF",
      name: "sun",
    },
    config: {
      background: "sunny-bg",
      ...config,
      target_rotate_speed: 0.45,
      rotation_speed: 1,
      acceleration: 0.025,
    },
  },

  {
    color: "purple_3",
    info: {
      score_to_next_level: 25,
      tint: "0x06E0FF",
      name: "blind",
    },
    config: {
      background: "blind-bg",
      ...config,
    },
  },

  {
    color: "red_4",
    info: {
      score_to_next_level: 35,
      tint: "0x06E0FF",
      name: "flower",
    },
    config: {
      background: "flower-bg",
      ...config,
      ball_distance: 116,
      rotation_speed: 1.2,
      acceleration: 0.05,
    },
  },

  {
    color: "blue_10",
    info: {
      score_to_next_level: 25,
      tint: "0xF0F0F0",
      name: "snow",
    },
    config: {
      background: "snow-bg",
      ...config,
      rotation_speed: 1.1,
      acceleration: 0.03,
    },
  },

  {
    color: "black_1",
    info: {
      score_to_next_level: 30,
      tint: "0x06E0FF",
      name: "threeStep",
    },
    config: {
      background: "threeStep-bg",
      ...config,
      rotation_speed: 1.15,
      acceleration: 0.04,
    },
  },

  {
    color: "pink_1",
    info: {
      score_to_next_level: 25,
      tint: "0x06E0FF",
      name: "chameleon",
    },
    config: {
      background: "cosmo-bg",
      ...config,
      rotation_speed: 1.15,
      acceleration: 0.05,
    },
  },

  {
    color: "yellow_5",
    info: {
      score_to_next_level: 25,
      tint: "0x06E0FF",
      name: "teleport",
    },
    config: {
      background: "teleport-bg",
      ...config,
      teleport_value: {
        min: -1,
        max: -3,
      },
      rotation_speed: 1.2,
      targets_amount: 10,
      additional_angle: 0,
      starting_target: 2,
    },
  },

  {
    color: "green_7",
    info: {
      score_to_next_level: 20,
      tint: "0x06E0FF",
      name: "sense",
    },
    config: {
      background: "sense-bg",
      ...config,
      rotation_speed: 1,
      acceleration: 0.03,
    },
  },

  {
    color: "pink_2",
    info: {
      score_to_next_level: 13,
      tint: "0x06E0FF",
      name: "clock",
    },
    config: {
      background: "time-bg",
      ...config,
      time_left: 15, //in seconds
    },
  },

  {
    color: "red_1",
    info: {
      score_to_next_level: 20,
      tint: "0x06E0FF",
      name: "speed",
    },
    config: {
      background: "speed-bg",
      ...config,
      rotation_speed: 2.3,
      acceleration: 0.02,
    },
  },

  {
    color: "gray_2",
    info: {
      score_to_next_level: 25,
      tint: "0x06E0FF",
      name: "confusion",
    },
    config: {
      background: "many-bg",
      ...config,
      rotation_speed: 1.25,
      acceleration: 0.04,
    },
  },

  {
    color: "brown_1",
    info: {
      score_to_next_level: 20,
      tint: "0x06E0FF",
      name: "earthquake",
    },
    config: {
      canvas_color:"0xadd8e6",
      background: "earthquake-bg",
      ...config,
      rotation_speed: 1.25,
      acceleration: 0.05,
    },
  },

  {
    color: "red_2",
    info: {
      score_to_next_level: 15,
      tint: "0x06E0FF",
      name: "hell",
    },
    config: {
      background: "hell-bg",
      ...config,
    },

    /*
  {
    info: {
      score_to_next_level:10 100,
      tint: "0x06E0FF",
      name: "perfect",
    },
    config: {
      background: "perfect-bg",
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 90,
      additional_angle: 22.5,
      starting_target: 1,
    },
  },
  */
  },
]
