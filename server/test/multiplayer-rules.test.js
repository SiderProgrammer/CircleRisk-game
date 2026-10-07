"use strict"
const test = require("node:test")
const assert = require("node:assert")
const rules = require("../src/shared/multiplayer-rules")
const constants = require("../src/settings/levels/constants")

const config = { ...constants, rotation_speed: 1.75, acceleration: 0.04 }
const layout = rules.targetLayout(config)
const SEED = "abc"

const angularSpeed = (state) => (state.speed * 60) / 1000

// moment the circle is exactly on the next target
function perfectTime(state) {
  const reach = (2 * Math.asin(state.r / (2 * state.d)) * 180) / Math.PI
  return rules.deathTime(state, layout) - reach / angularSpeed(state)
}

const distanceToTarget = (state, t) => {
  const circle = rules.circlePosition(state, rules.angleAt(state, t))
  const target = layout[state.next]
  return Math.hypot(circle.x - target.x, circle.y - target.y)
}

test("layout is a closed polygon matching Manager.addTarget", () => {
  assert.strictEqual(layout.length, config.targets_amount)
  for (let i = 1; i < layout.length; i++) {
    const side = Math.hypot(layout[i].x - layout[i - 1].x, layout[i].y - layout[i - 1].y)
    assert.ok(Math.abs(side - config.ball_distance) < 1e-9)
  }
})

test("next target is 1-3 ahead, wrapped, and evenly distributed", () => {
  const counts = [0, 0, 0]
  for (let i = 0; i < 30000; i++) {
    const current = i % config.targets_amount
    const next = rules.nextTarget(`seed${i}`, i, current, config.targets_amount)
    const offset = (next - current + config.targets_amount) % config.targets_amount
    assert.ok(offset >= 1 && offset <= 3)
    counts[offset - 1]++
  }
  counts.forEach((count) => assert.ok(Math.abs(count - 10000) < 400, `offset counts ${counts}`))
})

test("next target is deterministic for a seed", () => {
  assert.strictEqual(rules.nextTarget(SEED, 5, 2, 8), rules.nextTarget(SEED, 5, 2, 8))
})

test("perfect taps chain, death happens exactly at hit radius", () => {
  let state = rules.initialState(config, SEED, 1000)
  for (let i = 0; i < 60; i++) {
    const on_target = perfectTime(state)
    assert.ok(distanceToTarget(state, on_target) < 1e-6)

    const death_at = rules.deathTime(state, layout)
    assert.ok(Math.abs(distanceToTarget(state, death_at) - rules.HIT_RADIUS) < 1e-6)
    assert.deepStrictEqual(rules.evaluateTap(state, death_at, layout, config, SEED), {
      hit: false,
      death_at,
    })

    const result = rules.evaluateTap(state, on_target, layout, config, SEED)
    assert.ok(result.hit && result.perfect)
    assert.strictEqual(result.state.hits, i + 1)
    assert.strictEqual(result.state.score, 2 * (i + 1))
    assert.ok(Math.abs(result.state.speed - (config.rotation_speed + config.acceleration * (i + 1))) < 1e-9)
    state = result.state
  }
})

test("a tap far from the target misses and dies at the tap time", () => {
  const state = rules.initialState(config, SEED, 1000)
  const early = state.t0 + 1
  assert.ok(distanceToTarget(state, early) > rules.HIT_RADIUS)
  assert.deepStrictEqual(rules.evaluateTap(state, early, layout, config, SEED), {
    hit: false,
    death_at: early,
  })
})

test("a tap inside the radius but not perfect scores 1", () => {
  const state = rules.initialState(config, SEED, 1000)
  const t = perfectTime(state) + 100 // ~10 degrees late
  assert.ok(distanceToTarget(state, t) > rules.PERFECT_RADIUS)
  const result = rules.evaluateTap(state, t, layout, config, SEED)
  assert.ok(result.hit && !result.perfect)
  assert.strictEqual(result.state.score, 1)
})

test("the new pivot is where the circle was tapped", () => {
  const state = rules.initialState(config, SEED, 1000)
  const t = perfectTime(state) + 50
  const tapped = rules.circlePosition(state, rules.angleAt(state, t))
  const { state: next } = rules.evaluateTap(state, t, layout, config, SEED)
  assert.ok(Math.hypot(next.pivot.x - tapped.x, next.pivot.y - tapped.y) < 1e-9)
  assert.strictEqual(next.current, state.next)
  assert.strictEqual(next.t0, t)
})

const { PRESETS, DEFAULTS, settingsToConfig } = require("../src/shared/room-settings")

// plays `hits` perfect taps with any config and returns the visited states
function playPerfect(config, seed, hits) {
  const preset_layout = rules.targetLayout(config)
  let state = rules.initialState(config, seed, 1000)
  const states = [state]
  for (let i = 0; i < hits; i++) {
    const reach = (2 * Math.asin(state.r / (2 * state.d)) * 180) / Math.PI
    const on_target = rules.deathTime(state, preset_layout) - reach / ((state.speed * 60) / 1000)
    const circle = rules.circlePosition(state, rules.angleAt(state, on_target))
    const target = preset_layout[state.next]
    assert.ok(Math.hypot(circle.x - target.x, circle.y - target.y) < 1e-6, "circle reaches the target")

    const result = rules.evaluateTap(state, on_target, preset_layout, config, seed)
    assert.ok(result.hit && result.perfect)
    state = result.state
    states.push(state)
  }
  return states
}

test("every preset is playable: perfect taps always hit, in both directions", () => {
  PRESETS.forEach(({ name, settings }) => {
    const config = settingsToConfig(settings)
    const states = playPerfect(config, `seed-${name}`, 40)
    states.slice(1).forEach((state, i) => {
      const previous = states[i]
      const jump = (state.next - state.current + config.targets_amount) % config.targets_amount
      assert.ok(jump >= 1 && jump <= config.max_jump, `${name}: jump ${jump}`)
      if (config.max_speed) assert.ok(state.speed <= Math.max(config.max_speed, config.rotation_speed) + 1e-9)
      assert.strictEqual(state.r, config.hit_radius)
      if (config.direction === "zigzag") assert.strictEqual(state.dir, -previous.dir)
    })
  })
})

test("spin directions: counter-clockwise, and chaos mixes both", () => {
  const ccw = playPerfect(settingsToConfig({ ...DEFAULTS, direction: "ccw" }), "s", 10)
  assert.ok(ccw.every(({ dir }) => dir === -1))

  const chaos = playPerfect(settingsToConfig({ ...DEFAULTS, direction: "chaos" }), "s", 40)
  const dirs = new Set(chaos.map(({ dir }) => dir))
  assert.deepStrictEqual([...dirs].sort(), [-1, 1])
})

test("max speed caps the acceleration", () => {
  const config = settingsToConfig({ ...DEFAULTS, acceleration: 0.15, max_speed: 2 })
  const states = playPerfect(config, "s", 20)
  assert.strictEqual(states[states.length - 1].speed, 2)
})

test("a goal score finishes the player", () => {
  const config = settingsToConfig({ ...DEFAULTS, win_score: 10 })
  const states = playPerfect(config, "s", 5) // 5 perfects = 10 points
  assert.ok(!rules.isFinished(states[4], config))
  assert.ok(rules.isFinished(states[5], config))
  assert.ok(!rules.isFinished(states[5], settingsToConfig(DEFAULTS)))
})
