const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
  nickname: String,
  levels_scores: [Number],
  money: Number,
})

const levelsSchema = new mongoose.Schema({
  level: Number,
  nickname: String,
  score: Number,
})

module.exports = {
  Accounts: mongoose.model("Accounts", accountSchema),
  Levels: mongoose.model("Levels", levelsSchema),
}
