"use strict"
// Client payloads are untrusted: anything can arrive, including null or wrong types.

const DIFFICULTIES = ["easy", "medium", "hard"]

const asObject = (value) => (value && typeof value === "object" ? value : {})

const asAck = (value) => (typeof value === "function" ? value : () => {})

const asSkin = (value) => (Number.isInteger(value) ? value : undefined)

function sanitizeProfile(value) {
  const profile = asObject(value)
  const skins = asObject(profile.skins)
  return {
    nickname: String(profile.nickname || "Player").slice(0, 12),
    skins: {
      circles: asSkin(skins.circles),
      sticks: asSkin(skins.sticks),
      targets: asSkin(skins.targets),
    },
  }
}

function sanitizeTap(value) {
  const { seq, t } = asObject(value)
  return {
    seq: Number.isInteger(seq) ? seq : 0,
    t: typeof t === "number" && Number.isFinite(t) ? t : null,
  }
}

const sanitizeDifficulty = (value) => (DIFFICULTIES.includes(value) ? value : "easy")

const sanitizeRoomCode = (value) => String(value || "").trim().toUpperCase().slice(0, 4)

module.exports = {
  DIFFICULTIES,
  asObject,
  asAck,
  sanitizeProfile,
  sanitizeTap,
  sanitizeDifficulty,
  sanitizeRoomCode,
}
