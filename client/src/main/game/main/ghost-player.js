import rules from "../../../../../server/src/shared/multiplayer-rules"
import { serverNow } from "../../shortcuts/multiplayer-socket"

const GHOST_ALPHA = 0.45

// canvas renderer can't tint, so build a greyscale copy of an atlas frame once
function getGreyFrame(scene, atlas, frame_name) {
  const key = `grey:${atlas}:${frame_name}`
  if (scene.textures.exists(key)) return key

  const frame = scene.textures.getFrame(atlas, frame_name)
  const { cutX, cutY, cutWidth, cutHeight } = frame
  const texture = scene.textures.createCanvas(key, cutWidth, cutHeight)
  const context = texture.getContext()
  context.drawImage(
    frame.source.image,
    cutX,
    cutY,
    cutWidth,
    cutHeight,
    0,
    0,
    cutWidth,
    cutHeight
  )

  const image_data = context.getImageData(0, 0, cutWidth, cutHeight)
  const pixels = image_data.data
  for (let i = 0; i < pixels.length; i += 4) {
    const grey =
      0.3 * pixels[i] + 0.59 * pixels[i + 1] + 0.11 * pixels[i + 2]
    pixels[i] = pixels[i + 1] = pixels[i + 2] = grey
  }
  context.putImageData(image_data, 0, 0)
  texture.refresh()

  return key
}

function pickSkinFrame(scene, atlas, prefix, skin, fallback_skin) {
  const texture = scene.textures.get(atlas)
  if (skin !== undefined && texture.has(prefix + skin)) return prefix + skin
  return prefix + fallback_skin
}

// Draws the opponent from the server's authoritative state. Between taps the
// rotation is a function of time, so it is rendered where it is right now;
// the only visible latency is a short overshoot until the opponent's tap arrives.
export default class GhostPlayer {
  constructor(manager, opponent, layout, initial_state) {
    this.manager = manager
    this.scene = manager.scene
    this.opponent = opponent
    this.layout = layout
    this.state = initial_state
    this.frozen_at = null
    this.shown_next_target = null
  }

  // must be called after targets exist but before the local stick/circles,
  // so the ghost is drawn above targets and below the local player
  create() {
    const my_skins = this.manager.progress.current_skins
    const opponent_skins = (this.opponent && this.opponent.skins) || {}

    const circle_key = getGreyFrame(
      this.scene,
      "circles",
      pickSkinFrame(this.scene, "circles", "circle_", opponent_skins.circles, my_skins.circles)
    )
    const stick_key = getGreyFrame(
      this.scene,
      "sticks",
      pickSkinFrame(this.scene, "sticks", "stick_", opponent_skins.sticks, my_skins.sticks)
    )

    this.next_target_ring = this.scene.add.graphics().setDepth(0.1).setAlpha(0)
    this.stick = this.scene.add
      .image(0, 0, stick_key)
      .setOrigin(0, 0.5)
      .setDepth(0.1)
      .setAlpha(0)
    this.pivot = this.scene.add.image(0, 0, circle_key).setDepth(0.1).setAlpha(0)
    this.moving = this.scene.add.image(0, 0, circle_key).setDepth(0.1).setAlpha(0)

    this.name_text = this.scene.add
      .text(0, 0, (this.opponent && this.opponent.nickname) || "", {
        font: `28px ${main_font}`,
      })
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
