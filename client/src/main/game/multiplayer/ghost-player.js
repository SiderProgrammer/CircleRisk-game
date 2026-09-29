import rules from "../../multiplayer/rules"
import { serverNow } from "../../multiplayer/connection"
import getGreyFrame from "./grey-frame"

const GHOST_ALPHA = 0.45

function pickSkinFrame(scene, atlas, prefix, skin, fallback_skin) {
  const texture = scene.textures.get(atlas)
  if (skin !== undefined && texture.has(prefix + skin)) return prefix + skin
  return prefix + fallback_skin
}

// Draws the opponent, greyed out, from the server's authoritative state.
// Between taps the rotation is a function of time, so it is rendered where it is
// right now; the only visible latency is a short overshoot until a tap arrives.
export default class GhostPlayer {
  constructor(manager, opponent, layout, initial_state) {
    this.manager = manager
    this.scene = manager.scene
    this.opponent = opponent || {}
    this.layout = layout
    this.state = initial_state
    this.frozen_at = null
    this.shown_next_target = null
  }

  get score() {
    return this.state.score
  }

  // must be called after targets exist but before the local stick/circles,
  // so the ghost is drawn above targets and below the local player
  create() {
    const my_skins = this.manager.progress.current_skins
    const skins = this.opponent.skins || {}
    const circle = getGreyFrame(
      this.scene,
      "circles",
      pickSkinFrame(this.scene, "circles", "circle_", skins.circles, my_skins.circles)
    )
    const stick = getGreyFrame(
      this.scene,
      "sticks",
      pickSkinFrame(this.scene, "sticks", "stick_", skins.sticks, my_skins.sticks)
    )

    const add = this.scene.add
    this.next_target_ring = add.graphics().setDepth(0.1).setAlpha(0)
    this.stick = add.image(0, 0, stick).setOrigin(0, 0.5).setDepth(0.1).setAlpha(0)
    this.pivot = add.image(0, 0, circle).setDepth(0.1).setAlpha(0)
    this.moving = add.image(0, 0, circle).setDepth(0.1).setAlpha(0)
    this.name_text = add
      .text(0, 0, this.opponent.nickname || "", { font: `28px ${main_font}` })
      .setOrigin(0.5, 1)
      .setDepth(0.1)
      .setAlpha(0)
  }

  show() {
    this.scene.tweens.add({
      targets: [this.stick, this.pivot, this.moving, this.name_text],
      alpha: GHOST_ALPHA,
      duration: this.manager.intro_duration,
    })
    this.next_target_ring.setAlpha(GHOST_ALPHA)
    this.render()
  }

  setState(state) {
    if (state.hits < this.state.hits) return // stale
    this.state = state
  }

  render() {
    const now = this.frozen_at !== null ? this.frozen_at : serverNow()
    // without a tap the opponent can't get past its death point
    const time = Math.min(now, rules.deathTime(this.state, this.layout))
    this.draw(this.state, rules.angleAt(this.state, time))
  }

  draw(state, angle) {
    const origin = this.manager.target_array[0]
    const pivot_x = origin.x + state.pivot.x
    const pivot_y = origin.y + state.pivot.y
    const circle = rules.circlePosition(state, angle)

    this.pivot.setPosition(pivot_x, pivot_y)
    this.moving.setPosition(origin.x + circle.x, origin.y + circle.y)

    // same geometry as LevelHelper.extendStick / centerStick
    const stick_offset = this.pivot.displayWidth / 2 - 5
    const stick_angle = Phaser.Math.DegToRad(angle + 90)
    this.stick.displayWidth = state.d - this.pivot.displayWidth + 10
    this.stick
      .setAngle(angle)
      .setPosition(
        pivot_x + stick_offset * Math.sin(stick_angle),
        pivot_y - stick_offset * Math.cos(stick_angle)
      )

    this.name_text.setPosition(pivot_x, pivot_y - this.pivot.displayHeight / 2 - 4)

    if (state.next !== this.shown_next_target) this.drawNextTargetRing(state.next)
  }

  drawNextTargetRing(target_index) {
    this.shown_next_target = target_index
    const target = this.manager.target_array[target_index]
    this.next_target_ring.clear()
    if (!target) return

    this.next_target_ring.lineStyle(6, 0xbbbbbb, 1)
    this.next_target_ring.strokeCircle(target.x, target.y, target.displayWidth / 2 + 10)
  }

  die(death_at) {
    if (this.frozen_at !== null) return
    this.frozen_at = death_at
    this.render()
    this.scene.tweens.add({
      targets: [this.stick, this.pivot, this.moving, this.next_target_ring],
      alpha: 0.1,
      duration: 400,
    })
  }
}
