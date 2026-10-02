"use strict"
// Pure game rules for multiplayer basic levels, shared by the server (authority)
// and the client (prediction). No dependencies, no side effects.
//
// Between taps the rotating circle moves at a constant angular speed around the
// pivot, so the whole game can be computed from timestamps instead of frames.
// Positions are relative to target 0: layouts on different devices only differ
// by a translation (game height is dynamic).
//
// Optional config fields (room-settings.js), defaults reproduce the basic level:
// hit_radius (85), direction ("cw"), max_jump (3), max_speed (0 = none), win_score (0 = none)

const HIT_RADIUS = 85 // Manager.hasHitTarget: 85 * target scale (1 in basic levels)
const PERFECT_RADIUS = 5
const FPS = 60 // rotation_speed in configs is degrees per frame at 60 fps

const DEG = Math.PI / 180

function wrap360(angle) {
  return ((angle % 360) + 360) % 360
}

function wrap180(angle) {
  const wrapped = wrap360(angle)
  return wrapped > 180 ? wrapped - 360 : wrapped
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

// same formula as Manager.addTarget
function targetLayout(config) {
  const angle_between = 360 / config.targets_amount
  const layout = [{ x: 0, y: 0 }]
  for (let i = 1; i < config.targets_amount; i++) {
    const radians = (config.additional_angle + angle_between * i) * DEG
    const previous = layout[i - 1]
    layout.push({
      x: previous.x + config.ball_distance * Math.sin(radians),
      y: previous.y + config.ball_distance * Math.cos(radians),
    })
  }
  return layout
}

function hashSeed(seed) {
  // FNV-1a
  let hash = 0x811c9dc5
  const string = String(seed)
  for (let i = 0; i < string.length; i++) {
    hash ^= string.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

// stateless random number for (seed, index, salt) so a server correction can never
// desync the client's sequence
function hash(seed, index, salt = 0) {
  let x = (hashSeed(seed) ^ Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(salt, 0x7feb352d)) >>> 0
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b) >>> 0
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0
  return (x ^ (x >>> 16)) >>> 0
}

// LevelHelper.randomNextTarget + checkNewTargetsQueue, 1..max_jump targets ahead
function nextTarget(seed, hit_index, current, targets_amount, max_jump = 3) {
  const next = current + 1 + (hash(seed, hit_index) % max_jump)
  return next > targets_amount - 1 ? next - targets_amount : next
}

// rotation direction for the circle after `hit_index` hits (1 = clockwise on screen)
function directionAfter(config, seed, hit_index, previous) {
  switch (config.direction) {
    case "ccw":
      return -1
    case "zigzag":
      return hit_index === 0 ? 1 : -previous
    case "chaos":
      return hash(seed, hit_index, 1) % 2 ? 1 : -1
    default:
      return 1
  }
}

function createState({ t0, a0, pivot, speed, dir, r, current, next, hits, score }, layout) {
  return {
    t0,
    a0,
    pivot,
    speed,
    dir,
    r, // hit radius
    current,
    next,
    hits,
    score,
    d: distance(pivot, layout[next]), // orbit radius, passes exactly through the next target
  }
}

function initialState(config, seed, start_at) {
  const layout = targetLayout(config)
  const current = config.starting_target
  return createState(
    {
      t0: start_at,
      a0: 270, // Manager.init rotation_angle
      pivot: { x: layout[current].x, y: layout[current].y },
      speed: config.rotation_speed,
      dir: directionAfter(config, seed, 0, 1),
      r: config.hit_radius || HIT_RADIUS,
      current,
      next: nextTarget(seed, 0, current, config.targets_amount, config.max_jump),
      hits: 0,
      score: 0,
    },
    layout
  )
}

function angularSpeed(state) {
  return (state.speed * FPS) / 1000 // degrees per ms
}

function angleAt(state, t) {
  return state.a0 + state.dir * angularSpeed(state) * Math.max(0, t - state.t0)
}

function circlePosition(state, angle) {
  return {
    x: state.pivot.x + state.d * Math.cos(angle * DEG),
    y: state.pivot.y + state.d * Math.sin(angle * DEG),
  }
}

function targetAngle(state, layout) {
  const target = layout[state.next]
  return Math.atan2(target.y - state.pivot.y, target.x - state.pivot.x) / DEG
}

// moment the circle passes the target out of reach (analytic Manager.checkIfMissedTarget)
function deathTime(state, layout) {
  const travel = wrap360(state.dir * (targetAngle(state, layout) - state.a0))
  const reach = 2 * Math.asin(Math.min(1, state.r / (2 * state.d))) / DEG
  return state.t0 + (travel + reach) / angularSpeed(state)
}

// reached the room's target score (only with a "first to N" goal)
function isFinished(state, config) {
  return config.win_score > 0 && state.score >= config.win_score
}

// returns { hit, perfect, state } or { hit: false, death_at }
function evaluateTap(state, t, layout, config, seed) {
  const death_at = deathTime(state, layout)
  if (t >= death_at) return { hit: false, death_at }

  const angle = angleAt(state, t)
  const delta = wrap180(angle - targetAngle(state, layout))
  const chord = 2 * state.d * Math.abs(Math.sin((delta * DEG) / 2))
  if (chord >= state.r) return { hit: false, death_at: t }

  const perfect = chord < PERFECT_RADIUS
  const new_pivot = circlePosition(state, angle)
  const old_pivot = state.pivot
  const current = state.next
  const hits = state.hits + 1
  const speed = state.speed + config.acceleration

  return {
    hit: true,
    perfect,
    state: createState(
      {
        t0: t,
        // Manager.changeBall: angle from the new pivot towards the old one
        a0: Math.atan2(old_pivot.y - new_pivot.y, old_pivot.x - new_pivot.x) / DEG,
        pivot: new_pivot,
        speed: config.max_speed > 0 ? Math.min(speed, Math.max(config.max_speed, state.speed)) : speed,
        dir: directionAfter(config, seed, hits, state.dir),
        r: state.r,
        current,
        next: nextTarget(seed, hits, current, config.targets_amount, config.max_jump),
        hits,
        score: state.score + (perfect ? 2 : 1),
      },
      layout
    ),
  }
}

module.exports = {
  HIT_RADIUS,
  PERFECT_RADIUS,
  targetLayout,
  nextTarget,
  initialState,
  angleAt,
  circlePosition,
  deathTime,
  isFinished,
  evaluateTap,
}
