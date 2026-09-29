// The local player's side of an authoritative match: predicts every tap with the
// shared rules (so it feels instant) and reconciles with the server's verdicts.
// Pure logic, rendering is done by the level scene.
import rules from "./rules"

const sameState = (a, b) =>
  a.hits === b.hits && a.score === b.score && Math.abs(a.t0 - b.t0) < 0.5

export default class LocalPlayer {
  constructor({ config, seed, startAt }) {
    this.config = config
    this.seed = seed
    this.layout = rules.targetLayout(config)
    this.state = rules.initialState(config, seed, startAt)
    this.frozen_at = null // set when predicted dead, the server has the final word
    this.is_dead = false // confirmed by the server
    this.tap_seq = 0
    this.corrections = 0 // server verdicts that differed from the prediction
  }

  get is_frozen() {
    return this.frozen_at !== null
  }

  angleAt(t) {
    return rules.angleAt(this.state, this.is_frozen ? this.frozen_at : t)
  }

  // freezes when the circle passes its target without a tap; returns true when it just did
  update(now) {
    if (this.is_frozen) return false
    const death_at = rules.deathTime(this.state, this.layout)
    if (now < death_at) return false
    this.frozen_at = death_at
    return true
  }

  // returns the predicted { seq, hit, perfect } or null when tapping isn't possible
  tap(t) {
    if (this.is_frozen) return null
    const seq = ++this.tap_seq
    const result = rules.evaluateTap(this.state, t, this.layout, this.config, this.seed)
    if (!result.hit) {
      this.frozen_at = result.death_at
      return { seq, hit: false }
    }
    this.state = result.state
    return { seq, hit: true, perfect: result.perfect }
  }

  // applies a server verdict about one of our taps; returns null when the prediction
  // was right, otherwise what changed: { gained_hit, perfect, unfrozen, frozen }
  reconcile({ hit, perfect, state }, now) {
    if (this.is_dead) return null

    if (hit) {
      // an older tap's confirmation, our later predictions already build on it
      // (if the server judged it differently, its verdict on the later tap will say so)
      if (state.hits < this.state.hits || sameState(state, this.state)) return null
      const gained_hit = state.hits > this.state.hits // a tap we predicted as a miss
      const unfrozen = this.is_frozen
      this.state = state
      this.frozen_at = null
      this.corrections++
      return { gained_hit, perfect, unfrozen, frozen: false }
    }

    // a miss: the server kept its state, undo any hit we predicted for this tap;
    // player:died with the exact death time follows
    if (sameState(state, this.state)) return null
    this.state = state
    this.corrections++
    const frozen = !this.is_frozen
    if (frozen) this.frozen_at = Math.min(now, rules.deathTime(state, this.layout))
    return { gained_hit: false, unfrozen: false, frozen }
  }

  died(t) {
    this.is_dead = true
    this.frozen_at = t
  }
}
