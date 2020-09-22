const mongoose = require("mongoose")

const srvConfig = require("./config")
const { Accounts, Levels } = require("./model")
const customizeSkinsSetup = require("./customize-skins-setup")

const DATABASE_URL = `mongodb+srv://${srvConfig.USERNAME}:${srvConfig.PASSWORD}@${srvConfig.HOST}/${srvConfig.DB}?retryWrites=true&w=majority`

class DatabaseManager {
  constructor() {
    this.levels_amount = 4
  }
  connectDatabase() {
    mongoose.connect(
      DATABASE_URL,

      {
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
  getCustomizeSkinsSetup(res) {
    res.send(customizeSkinsSetup)
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

  createAccount(req, res) {
    Accounts.create(
      {
        nickname: req.body.nickname,
        levels_scores: [0],
        money: 5550,
        skins: { circles: [1], sticks: [1], targets: [1] },
        current_skins: { circles: 1, sticks: 1, targets: 1 },
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
      .gt(start_search_rank - 1)
      .lt(stop_search_rank + 1)

      .then((levels) => {
        const sorted_levels = levels.sort((a, b) => a.rank - b.rank)
        res.status(200).json(sorted_levels)
      })
  }

  postLevelScore(req, res) {
    // can use nested destructing ~ {body:{score,nickname,level}}
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

    Accounts.findOne({ nickname: nickname }, (err, account) => {
      account.levels_scores[level - 1] = score
      account.markModified("levels_scores")
      account.save()
    })
  }

  saveMoney(req, res) {
    const options = {
      upsert: true,
      new: true, // remove unnecessary options
      setDefaultsOnInsert: true,
      useFindAndModify: false,
    }
    Accounts.findOneAndUpdate(
      { nickname: req.body.nickname },
      { money: req.body.money },
      options,
      (err, c) => {
        res.sendStatus(200)
      }
    )
  }

  saveNewSkin(req, res) {
    Accounts.findOne({ nickname: req.body.nickname }, (err, account) => {
      const part = req.body.skin[0]
      const skin_number = req.body.skin[1]
      account.skins[part].push(skin_number)
      account.markModified("skins")
      account.save()
    })
  }

  equipSkin(req, res) {
    const options = {
      upsert: true,
      new: true, // remove unnecessary options
      setDefaultsOnInsert: true,
      useFindAndModify: false,
    }

    Accounts.findOneAndUpdate(
      { nickname: req.body.nickname },
      { current_skins: req.body.current_skins },
      options,
      (err, callback) => {
        res.sendStatus(200)
      }
    )
  }
}

mongoose.connection.on("error", (error) => {
  console.log("ERROR !", error)
  process.exit(1)
})

mongoose.connection.on("connected", async function () {
  console.log("connected to mongo")
})

module.exports = DatabaseManager
