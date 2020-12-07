const config = require("./constants")

module.exports = [
  {
    page_color: "red",
    info: {
      score_to_next_level: 60,
      tint: "0x00FF00",
      name: "basic",
    },
    config: {
      background: "basic-bg",
      ...config,
      rotation_speed: 1.75,
      acceleration: 0.04,
    },
  },

  {
    info: {
      score_to_next_level: 20,
      tint: "0xFF6E00",
      name: "wind",
    },
    config: {
      background: "autumn-bg",
      ...config,
      targets_speed: 1.5,
      rotation_speed: 1.75,
      acceleration: 0.04,
    },
  },
  {
    info: {
      score_to_next_level: 30,
      tint: "0xFF00FF",
      name: "night",
    },
    config: {
      background: "night-bg",
      ...config,
      rotation_speed: 1.5,
      target_rotate_speed: 1.5,
      acceleration: 0.1,
    },
  },

  {
    info: {
      score_to_next_level: 40,
      tint: "0xF0F0F0",
      name: "snow",
    },
    config: {
      background: "snow-bg",
      ...config,
      rotation_speed_change: {
        min: 0.5,
        max: 3.5,
      },
    },
  },
  {
    info: {
      score_to_next_level: 50,
      tint: "0xFFF000",
      name: "reverse",
    },
    config: {
      canvas_color: "00ff00",
      background: "reverse-bg",
      ...config,
    },
  },
  {
    info: {
      score_to_next_level: 60,
      tint: "0x0000FF",
      name: "sun",
    },
    config: {
      background: "sunny-bg",
      ...config,
      target_rotate_speed: 0.5,
    },
  },
  {
    info: {
      score_to_next_level: 70,
      tint: "0x06E0FF",
      name: "expand",
    },
    config: {
      background: "star-bg",
      ...config,
    },
  },

  {
    info: {
      score_to_next_level: 80,
      tint: "0x06E0FF",
      name: "earthquake",
    },
    config: {
      canvas_color: "add8e6",
      background: "earthquake-bg",
      ...config,
      time_left: 10, //in seconds
    },
  },
  {
    info: {
      score_to_next_level: 220,
      tint: "0x06E0FF",
      name: "threeStep",
    },
    config: {
      background: "hell-bg",
      ...config,
    },
  },
  {
    info: {
      score_to_next_level: 75,
      tint: "0x06E0FF",
      name: "carousel",
    },
    config: {
      background: "carousel-bg",
      ...config,
      targets_speed: 2.5,
      rotation_speed: 1.75,
      acceleration: 0.04,
    },
  },
  {
    info: {
      score_to_next_level: 90,
      tint: "0x06E0FF",
      name: "twins",
    },
    config: {
      background: "twins-bg",
      ...config,
      teleport_value: {
        min: -1,
        max: -3,
      },
    },
  },
  {
    info: {
      score_to_next_level: 10,
      tint: "0x06E0FF",
      name: "clock",
    },
    config: {
      background: "time-bg",
      ...config,
      time_left: 10, //in seconds
    },
  },
  /*
  {
    info: {
      score_to_next_level: 100,
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
  {
    info: {
      score_to_next_level: 110,
      tint: "0x06E0FF",
      name: "chameleon",
    },
    config: {
      background: "cosmo-bg",
      ...config,
      targets_speed: 1,
      teleport_value: {
        min: -1,
        max: -3,
      },
    },
  },

  {
    info: {
      score_to_next_level: 130,
      tint: "0x06E0FF",
      name: "confusion",
    },
    config: {
      background: "many-bg",
      ...config,
    },
  },

  {
    info: {
      score_to_next_level: 140,
      tint: "0x06E0FF",
      name: "speed",
    },
    config: {
      background: "speed-bg",
      ...config,
    },
  },

  {
    info: {
      score_to_next_level: 150,
      tint: "0x06E0FF",
      name: "flower",
    },
    config: {
      background: "flower-bg",
      ...config,
      rotation_speed_change: {
        min: 0.5,
        max: 3.5,
      },
    },
  },
  {
    info: {
      score_to_next_level: 160,
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
      targets_speed: 1,
    },
  },

  {
    info: {
      score_to_next_level: 170,
      tint: "0x06E0FF",
      name: "unstable",
    },
    config: {
      background: "unstable-bg",

      rotation_speed_change: {
        min: 0.5,
        max: 3.5,
      },
      ...config,
    },
  },
  {
    info: {
      score_to_next_level: 180,
      tint: "0x06E0FF",
      name: "pulsate",
    },
    config: {
      background: "pulsate-bg",
      ...config,
    },
  },
  {
    info: {
      score_to_next_level: 190,
      tint: "0x06E0FF",
      name: "blind",
    },
    config: {
      background: "blind-bg",
      ...config,
      targets_speed: 1,
    },
  },

  {
    info: {
      score_to_next_level: 200,
      tint: "0x06E0FF",
      name: "sense",
    },
    config: {
      background: "sense-bg",
      ...config,
    },
  },

  {
    info: {
      score_to_next_level: 210,
      tint: "0x06E0FF",
      name: "tiny",
    },
    config: {
      background: "tiny-bg",
      ...config,
    },
  },

  {
    info: {
      score_to_next_level: 220,
      tint: "0x06E0FF",
      name: "hell",
    },
    config: {
      background: "hell-bg",
      ...config,
      rotation_speed_change: {
        min: 0.5,
        max: 3.5,
      },
    },
  },
  {
    info: {
      score_to_next_level: 220,
      tint: "0x06E0FF",
      name: "oneStep",
    },
    config: {
      background: "hell-bg",
      ...config,
    },
  },
]
