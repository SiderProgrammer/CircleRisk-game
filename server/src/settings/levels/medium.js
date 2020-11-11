module.exports = [
  {
    page_color: "red",
    info: {
      score_to_next_level: 10,
      tint: "0x00FF00",
      name: "basic",
    },
    config: {
      background: "basic-bg",
      rotation_speed: 1,
      acceleration: 0.01,
      targets_amount: 8,
      ball_distance: 175,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 1,
      acceleration: 0.02,
      targets_amount: 8,
      ball_distance: 110,
      additional_angle: 22.5,
      starting_target: 1,
      targets_speed: 0.3,
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
      rotation_speed: 1,
      acceleration: 0.03,
      targets_amount: 8,
      ball_distance: 130,
      additional_angle: 22.5,
      starting_target: 1,
      target_rotate_speed: 0.5,
    },
  },

  {
    info: {
      score_to_next_level: 40,
      tint: "0xF0F0F0",
      name: "snow",
    },
    config: {
      rotation_speed_change: {
        min: 0.5,
        max: 3.5,
      },
      background: "snow-bg",
      rotation_speed: 1,
      acceleration: 0.04,
      targets_amount: 8,
      ball_distance: 100,
      additional_angle: 22.5,
      starting_target: 1,
    },
  },
  {
    info: {
      score_to_next_level: 50,
      tint: "0xFFF000",
      name: "reverse",
    },
    config: {
      background: "reverse-bg",
      rotation_speed: 1,
      acceleration: 0.05,
      targets_amount: 8,
      ball_distance: 130,
      additional_angle: 22.5,
      starting_target: 6,
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
      rotation_speed: 0.2,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 130,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 1,
      acceleration: 0.07,
      targets_amount: 8,
      ball_distance: 140,
      additional_angle: 22.5,
      starting_target: 1,
    },
  },

  {
    info: {
      score_to_next_level: 80,
      tint: "0x06E0FF",
      name: "earthquake",
    },
    config: {
      background: "earthquake-bg",
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 90,
      additional_angle: 22.5,
      starting_target: 1,
      time_left: 10, //in seconds
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
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 90,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 90,
      additional_angle: 22.5,
      starting_target: 1,
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
      score_to_next_level: 100,
      tint: "0x06E0FF",
      name: "carousel",
    },
    config: {
      background: "carousel-bg",
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 130,
      additional_angle: 22.5,
      starting_target: 1,
      targets_speed: 1,
    },
  },
  {
    info: {
      score_to_next_level: 110,
      tint: "0x06E0FF",
      name: "chameleon",
    },
    config: {
      background: "cosmo-bg",
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 90,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 90,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 3,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 90,
      additional_angle: 22.5,
      starting_target: 1,
      teleport_value: {
        min: -1,
        max: -3,
      },
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
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 110,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 135,
      additional_angle: 22.5,
      starting_target: 1,
      teleport_value: {
        min: -1,
        max: -3,
      },
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
      rotation_speed: 1,
      rotation_speed_change: {
        min: 0.5,
        max: 3.5,
      },

      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 110,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 135,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 135,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 135,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 3,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 135,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 1,
      acceleration: 0.06,
      targets_amount: 8,
      ball_distance: 135,
      additional_angle: 22.5,
      starting_target: 1,
      time_left: 10,
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
      rotation_speed: 1,
      acceleration: 0.3,
      targets_amount: 8,
      ball_distance: 135,
      additional_angle: 22.5,
      starting_target: 1,
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
      rotation_speed: 1,
      acceleration: 0.3,
      targets_amount: 8,
      ball_distance: 135,
      additional_angle: 22.5,
      starting_target: 1,
    },
  },
]
