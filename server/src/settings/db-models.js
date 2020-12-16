const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
  nickname:{
    index:true,
    type: String,
  },
  money: Number,
  skins: { circles: [Number], sticks: [Number], targets: [Number] },
  current_skins: { circles: Number, sticks: Number, targets: Number },
})

const levelsSchema = new mongoose.Schema({
  // SAVE _ID AS NICKNAME
  _id:String, // _id === nickname
  // maybe LEVEL NAME - BASIC AND DIFFICULTY - DIFFICULTY and create indexes on both
  level:{index:true,type:String},
  score: {type:Number},
})

//levelsSchema.index({_id:1,level:1}); // is this index working?


module.exports = {
  Accounts: mongoose.model("Accounts", accountSchema),
  Levels: mongoose.model("Levels", levelsSchema),
}
