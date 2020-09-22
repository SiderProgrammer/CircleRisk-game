const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
  nickname: String,
  levels_scores: [Number],
  money: Number,
  skins: { circles: [Number], sticks: [Number], targets: [Number] },
  current_skins: { circles: Number, sticks: Number, targets: Number },
})

const levelsSchema = new mongoose.Schema({
  level: Number,
  nickname: String,
  rank: {
    type: Number,
    default: 0,
  },
  score: Number,
})

module.exports = {
  Accounts: mongoose.model("Accounts", accountSchema),
  Levels: mongoose.model("Levels", levelsSchema),
}
