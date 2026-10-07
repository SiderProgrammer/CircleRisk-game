"use strict"
// Custom room settings, shared by the client (configurator UI) and the server
// (validation). Every setting is a choice from a fixed list, so anything a client
// sends can be validated by looking it up.

const TARGET_DIAMETER = 114 // target sprite size at scale 1
const HIT_RADIUS = { small: 65, normal: 85, large: 105 }
const BASE_BALL_DISTANCE = 175
const MAX_LAYOUT_WIDTH = 680 // game width is 720

const ARENAS = [
  { value: "basic-bg", label: "CLASSIC" },
  { value: "autumn-bg", label: "AUTUMN" },
  { value: "sunny-bg", label: "SUNNY" },
  { value: "night-bg", label: "NIGHT" },
  { value: "snow-bg", label: "SNOW" },
  { value: "star-bg", label: "STARS" },
  { value: "cosmo-bg", label: "COSMOS" },
  { value: "hell-bg", label: "HELL" },
  { value: "flower-bg", label: "FLOWERS" },
  { value: "green-bg", label: "MEADOW" },
]

const speedLabel = (value) => `x${value.toFixed(value * 10 % 1 ? 2 : 1)}`

// order = order of rows in the configurator
const OPTIONS = [
  {
    key: "targets",
    label: "TARGETS",
    values: [4, 5, 6, 7, 8, 9, 10].map((value) => ({ value, label: String(value) })),
    default: 8,
  },
  {
    key: "start_speed",
    label: "START SPEED",
    values: [0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.75, 2, 2.4, 2.8].map((value) => ({
      value,
      label: speedLabel(value),
    })),
    default: 1,
  },
  {
    key: "acceleration",
    label: "SPEED UP",
    values: [
      { value: 0, label: "NONE" },
      { value: 0.01, label: "TINY" },
      { value: 0.02, label: "LOW" },
      { value: 0.04, label: "MEDIUM" },
      { value: 0.06, label: "HIGH" },
      { value: 0.1, label: "BRUTAL" },
      { value: 0.15, label: "INSANE" },
    ],
    default: 0.02,
  },
  {
    key: "max_speed",
    label: "MAX SPEED",
    values: [
      { value: 0, label: "NO LIMIT" },
      ...[1.5, 2, 2.5, 3, 4, 5].map((value) => ({ value, label: speedLabel(value) })),
    ],
    default: 0,
  },
  {
    key: "target_size",
    label: "TARGET SIZE",
    values: [
      { value: "small", label: "SMALL" },
      { value: "normal", label: "NORMAL" },
      { value: "large", label: "LARGE" },
    ],
    default: "normal",
  },
  {
    key: "direction",
    label: "SPIN",
    values: [
      { value: "cw", label: "CLOCKWISE" },
      { value: "ccw", label: "COUNTER" },
      { value: "zigzag", label: "ZIGZAG" },
      { value: "chaos", label: "CHAOS" },
    ],
    default: "cw",
  },
  {
    key: "max_jump",
    label: "MAX JUMP",
    values: [1, 2, 3, 4].map((value) => ({ value, label: `${value} AHEAD` })),
    default: 3,
  },
  {
    key: "win_score",
    label: "GOAL",
    values: [
      { value: 0, label: "SURVIVE" },
      ...[10, 20, 30, 50].map((value) => ({ value, label: `FIRST TO ${value}` })),
    ],
    default: 0,
  },
  { key: "arena", label: "ARENA", values: ARENAS, default: "basic-bg" },
]

const DEFAULTS = OPTIONS.reduce((settings, option) => {
  settings[option.key] = option.default
  return settings
}, {})

const PRESETS = [
  { name: "CLASSIC EASY", settings: {} },
  { name: "CLASSIC MEDIUM", settings: { start_speed: 1.4, acceleration: 0.06 } },
  { name: "CLASSIC HARD", settings: { start_speed: 1.75, acceleration: 0.04 } },
  {
    name: "ZIGZAG",
    settings: { direction: "zigzag", start_speed: 1.2, acceleration: 0.04, arena: "autumn-bg" },
  },
  {
    name: "CHAOS",
    settings: {
      direction: "chaos",
      max_jump: 4,
      start_speed: 1.2,
      acceleration: 0.04,
      arena: "hell-bg",
    },
  },
  {
    name: "SNIPER",
    settings: { target_size: "small", start_speed: 0.8, acceleration: 0.02, arena: "night-bg" },
  },
  {
    name: "SPRINT",
    settings: {
      win_score: 20,
      start_speed: 1.6,
      acceleration: 0.1,
      max_speed: 3,
      arena: "sunny-bg",
    },
  },
  {
    name: "TINY RING",
    settings: { targets: 4, max_jump: 2, start_speed: 1.2, acceleration: 0.06, arena: "snow-bg" },
  },
].map((preset) => ({ ...preset, settings: { ...DEFAULTS, ...preset.settings } }))

const CLASSIC_PRESETS = PRESETS.filter(({ name }) => name.startsWith("CLASSIC"))

function getOption(key) {
  return OPTIONS.find((option) => option.key === key)
}

// keeps only known keys with allowed values, everything else falls back to defaults
function sanitizeSettings(raw) {
  const input = raw && typeof raw === "object" ? raw : {}
  const settings = {}
  OPTIONS.forEach(({ key, values, default: fallback }) => {
    const allowed = values.some(({ value }) => value === input[key])
    settings[key] = allowed ? input[key] : fallback
  })
  // can't jump further than the ring is long
  settings.max_jump = Math.min(settings.max_jump, settings.targets - 1)
  return settings
}

function findPreset(settings) {
  return PRESETS.find((preset) =>
    OPTIONS.every(({ key }) => preset.settings[key] === settings[key])
  )
}

// the level config used by the game and the shared rules
function settingsToConfig(raw) {
  const settings = sanitizeSettings(raw)
  const hit_radius = HIT_RADIUS[settings.target_size]
  const target_diameter = TARGET_DIAMETER * (hit_radius / HIT_RADIUS.normal)
  const n = settings.targets
  // regular polygon whose width (plus one target) fits on screen
  const max_side = (MAX_LAYOUT_WIDTH - target_diameter) * Math.sin(Math.PI / n)

  return {
    background: settings.arena,
    targets_amount: n,
    ball_distance: Math.min(BASE_BALL_DISTANCE, max_side),
    additional_angle: 180 / n, // flat top, as the original 8-target layout (22.5)
    starting_target: 1,
    rotation_speed: settings.start_speed,
    acceleration: settings.acceleration,
    max_speed: settings.max_speed,
    hit_radius,
    target_scale: hit_radius / HIT_RADIUS.normal,
    direction: settings.direction,
    max_jump: settings.max_jump,
    win_score: settings.win_score,
  }
}

function labelOf(key, value) {
  const option = getOption(key)
  const choice = option && option.values.find((v) => v.value === value)
  return choice ? choice.label : String(value)
}

// one-line summary shown to both players before the match
function describeSettings(raw) {
  const settings = sanitizeSettings(raw)
  const preset = findPreset(settings)
  const parts = [
    preset ? preset.name : "CUSTOM",
    `${settings.targets} TARGETS`,
    `SPEED ${labelOf("start_speed", settings.start_speed)}`,
  ]
  if (settings.direction !== "cw") parts.push(labelOf("direction", settings.direction))
  if (settings.target_size !== "normal") parts.push(`${labelOf("target_size", settings.target_size)} TARGETS`)
  if (settings.win_score) parts.push(labelOf("win_score", settings.win_score))
  return parts.join("  ·  ")
}

module.exports = {
  OPTIONS,
  DEFAULTS,
  PRESETS,
  CLASSIC_PRESETS,
  getOption,
  sanitizeSettings,
  findPreset,
  settingsToConfig,
  labelOf,
  describeSettings,
}
