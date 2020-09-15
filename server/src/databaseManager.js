const mongoose = require("mongoose")
const srvConfig = require("./config")
const { Accounts, Levels } = require("./model")

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
        //  mongoose.connection.dropDatabase()
      }
    )
  }

  createAccount(req, res) {
    Accounts.create(
      {
        nickname: req.body.nickname,
        levels_scores: [1, 2, 3],
      },
      () => res.sendStatus(200)
    )
    console.log("created account")
  }

  getLevelScoresAndNicknames(req, res) {
    Levels.find({ level: req.body.level }).then((levels) => {
      res.status(200).json(levels)
    })
  }

  postLevelScore(req, res) {
    const { score, nickname, level } = req.body

    const query = { nickname: nickname }

    const update = {
      score: score,
      nickname: nickname,
      level: level,
    }

    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      useFindAndModify: false,
    }

    Levels.findOneAndUpdate(query, update, options, (err, c) =>
      res.sendStatus(200)
    )
  }

  getUsers(res) {
    Accounts.find({}, (error, users) => {
      res.json(users)
    })
  }
  createTest(req, res) {
    Accounts.create(
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
