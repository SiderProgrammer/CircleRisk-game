const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
  _id:{
    alias:"nickname",
    type:String
  },

  money: Number,
  skins: { circles: [Number], sticks: [Number], targets: [Number] },
  current_skins: { circles: Number, sticks: Number, targets: Number },
})

const levelsSchema = new mongoose.Schema({

  // maybe LEVEL NAME - BASIC AND DIFFICULTY - DIFFICULTY and create indexes on both
  nickname:{type:String},
  level:{index:true,type:String,default:"easy-basic"}, // create good indexes
  score: {index:true,type:Number},
})

levelsSchema.index({nickname:1,level:1});
levelsSchema.index({level:1,score:1})

module.exports = {
  Accounts: mongoose.model("Accounts", accountSchema),
  Levels: mongoose.model("Levels", levelsSchema),
}
