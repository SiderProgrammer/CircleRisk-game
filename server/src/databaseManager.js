const mongoose = require("mongoose")
const srvConfig = require("./config")
const { Accounts, Levels } = require("./model")

class DatabaseManager {
  constructor() {
    this.levels_amount = 4
  }
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
        for (let i = 1; i <= this.levels_amount; i++) {
          this.updateRanks(i) /// make interval to update ranks from time to time
        }
      }
    )
  }

  updateRanks(level) {
    Levels.find({ level: level })
      .sort({ score: -1 })
      .exec((err, docs) => {
        docs.forEach((doc, i) => {
          Levels.updateOne(
            { _id: doc._id },
            { $set: { rank: i + 1 } },
            { multi: true }
          ).exec()
        })
      })
  }
  /*
      for (var i = 0; i < docs.length; i++) {
        Levels.updateOne(
          { _id: docs[i]._id },
          { $set: { __v: i + 1 } },
          { multi: true }
        ).exec()
      }
  */

  createAccount(req, res) {
    Accounts.create(
      {
        nickname: req.body.nickname,
        levels_scores: [5, 20],
        money: 30,
        skins: { circles: [1, 2, 3], sticks: [1, 2], targets: [1] },
      },
      () => res.sendStatus(200)
    )
    console.log("created account")
  }

  getAccountProgress(req, res) {
    Accounts.findOne({ nickname: req.body.nickname }).then((progress) => {
      console.log(progress)
      res.status(200).json(progress)
    })
  }

  getLevelScoresAndNicknames(req, res) {
    const { start_search_rank, stop_search_rank, level } = req.body

    Levels.find({ level: level })
      .where("rank")
      .gt(start_search_rank)
      .lt(stop_search_rank)

      .then((levels) => {
        const sorted_levels = levels.sort((a, b) => a.rank - b.rank)
        res.status(200).json(sorted_levels)
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
    /// if not found - create

    Levels.findOneAndUpdate(query, update, options, (err, c) =>
      res.sendStatus(200)
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
