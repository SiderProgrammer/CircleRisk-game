const mongoose = require("mongoose")
const srvConfig = require("./config")
const Users = require("./model")

class DatabaseManager {
  constructor() {}
  connectDatabase() {
    mongoose.connect(
      `mongodb+srv://${srvConfig.USERNAME}:${srvConfig.PASSWORD}@${srvConfig.HOST}/${srvConfig.DB}?retryWrites=true&w=majority`,
      {
        // <- Deployment server
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        // console.log(`Server started on port ${port}`);
        //   moongose.connection.close()
        // mongoose.disconnect();
      }
    )
  }

  createAccount(req, res) {
    Users.create(
      {
        nickname: req.body.nickname,
      },
      () => {
        Users.find({}, (error, users) => {
          res.status(200).send(users);
        })
      }
    )
  }
  getUsers(res) {
    Users.find({}, (error, users) => {
      res.json(users)
    })
  }
  createTest(req, res) {
    Users.create(
      { name: "fetched good", username: "tesname" },
      (error, post) => {
        console.log("fetched !")
        res.json(post)
      }
    )
  }
}

mongoose.connection.on("error", (error) => {
  console.log("ERROR !")
  console.log(error)
  process.exit(1)
})

mongoose.connection.on("connected", async function () {
  console.log("connected to mongo")
  //  await Users.create({ name: "NEWtes!!!!t", username: "tesname" });
  // await Users.find({}, (err, users) => console.log(users));
})

module.exports = DatabaseManager
