"use strict"
const test = require("node:test")
const assert = require("node:assert")
const settingsModule = require("../src/shared/room-settings")
const rules = require("../src/shared/multiplayer-rules")
const constants = require("../src/settings/levels/constants")

const { OPTIONS, DEFAULTS, PRESETS, sanitizeSettings, settingsToConfig, findPreset, describeSettings } =
  settingsModule

const TARGET_DIAMETER = 114

test("garbage settings fall back to defaults", () => {
  for (const raw of [null, undefined, 42, "x", [], { targets: 99, start_speed: "fast", arena: "../x" }])
    assert.deepStrictEqual(sanitizeSettings(raw), DEFAULTS)
})

test("valid values are kept, max jump is limited by the ring size", () => {
  const settings = sanitizeSettings({ targets: 4, max_jump: 4, direction: "chaos", win_score: 20 })
  assert.strictEqual(settings.targets, 4)
  assert.strictEqual(settings.max_jump, 3)
  assert.strictEqual(settings.direction, "chaos")
  assert.strictEqual(settings.win_score, 20)
})

test("default settings reproduce the original basic easy level", () => {
  const config = settingsToConfig(DEFAULTS)
  assert.strictEqual(config.targets_amount, constants.targets_amount)
  assert.strictEqual(config.ball_distance, constants.ball_distance)
  assert.strictEqual(config.additional_angle, constants.additional_angle)
  assert.strictEqual(config.starting_target, constants.starting_target)
  assert.strictEqual(config.rotation_speed, constants.rotation_speed)
  assert.strictEqual(config.acceleration, constants.acceleration)
  assert.strictEqual(config.hit_radius, rules.HIT_RADIUS)
})

test("every target count and size fits on screen without overlapping targets", () => {
  const counts = OPTIONS.find(({ key }) => key === "targets").values
  for (const { value: targets } of counts)
    for (const target_size of ["small", "normal", "large"]) {
      const config = settingsToConfig({ ...DEFAULTS, targets, target_size })
      const layout = rules.targetLayout(config)
      const diameter = TARGET_DIAMETER * config.target_scale
      const xs = layout.map(({ x }) => x)
      const ys = layout.map(({ y }) => y)
      const width = Math.max(...xs) - Math.min(...xs) + diameter
      const height = Math.max(...ys) - Math.min(...ys) + diameter
      assert.ok(width <= 700 && height <= 700, `${targets} ${target_size}: ${width}x${height}`)
      assert.ok(config.ball_distance >= diameter, `${targets} ${target_size} targets overlap`)
    }
})

test("presets are valid and recognised", () => {
  PRESETS.forEach((preset) => {
    assert.deepStrictEqual(sanitizeSettings(preset.settings), preset.settings, preset.name)
    assert.strictEqual(findPreset(preset.settings).name, preset.name)
  })
  assert.strictEqual(findPreset({ ...DEFAULTS, targets: 5 }), undefined)
  assert.match(describeSettings({ ...DEFAULTS, targets: 5 }), /^CUSTOM/)
  assert.match(describeSettings(PRESETS[3].settings), /ZIGZAG/)
})
