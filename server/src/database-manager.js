const mongoose = require("mongoose")

const srvConfig = require("./config")
const { Accounts, Levels } = require("./model")
const customizeSkinsSetup = require("./customize-skins-setup")

const DATABASE_URL = `mongodb+srv://${srvConfig.USERNAME}:${srvConfig.PASSWORD}@${srvConfig.HOST}/${srvConfig.DB}?retryWrites=true&w=majority`

class DatabaseManager {
  constructor() {
    this.levels_amount = 4
    this.leaderboards_refresh_time = 1000 * 60 * 1
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
        setInterval(() => {
          for (let i = 1; i <= this.levels_amount; i++) {
            this.updateRanks(i) /// make interval to update ranks from time to time
          }
        }, this.leaderboards_refresh_time)
      }
    )
  }
  getCustomizeSkinsSetup(res) {
    res.send(customizeSkinsSetup)
  }

  updateRanks(level) {
    Levels.find({ level: level }) // maybe fetch all levels in one request
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
    // use double destruction in req
    const nickname = req.body.nickname

    Accounts.exists({ nickname: nickname }).then((is_exsisting) => {
      if (is_exsisting) {
        res.sendStatus(403)
      } else {
        Accounts.create(
          {
            nickname: nickname,
            levels_scores: [0],
            money: 5550,
            skins: { circles: [1], sticks: [1], targets: [1] },
            current_skins: { circles: 1, sticks: 1, targets: 1 },
          },
          () => res.sendStatus(200)
        )
        console.log("account created")
      }
    })
  }

  getAccountProgress(req, res) {
    Accounts.findOne({ nickname: req.body.nickname }).then((progress) => {
      console.log(progress)
      res.status(200).json(progress)
    })
  }

  getLevelScoreByNickname(req,res){
    const {level,nickname} = req.body
    Levels.findOne({nickname:nickname,level:level}).then(level=>{
      res.status(200).json(level);
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
      level: level + 1,
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

    // saving in account progress
    Accounts.findOne({ nickname: nickname }, (err, account) => {
      account.levels_scores[level] = score
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
      res.sendStatus(200)
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
