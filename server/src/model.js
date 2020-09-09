const mongoose = require("mongoose")

//Create schema
const usersSchema = new mongoose.Schema({
  nickname: {
    type: String,
  },
})

//Create model
module.exports = mongoose.model("Users", usersSchema)
