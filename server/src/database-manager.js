const mongoose = require("mongoose")

//const srvConfig = require("./settings/db-config")

const { Accounts, Levels } = require("./settings/db-models")

const defaultAccountConfig = require("./settings/account-default-db")

const DATABASE_URL = require("./settings/db-config") // process.env.DB_URL //  `mongodb+srv://${srvConfig.USERNAME}:${srvConfig.PASSWORD}@${srvConfig.HOST}/${srvConfig.DB}?retryWrites=true&w=majority`

class DatabaseManager {
  constructor() {}
  connectDatabase() {
    mongoose.connect(
      DATABASE_URL,

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        //  poolSize: 10
        // autoIndex: false,
      },
      () => {}
    )
  }

  createAccount(req, res) {
    // use double destruction in req
    const nickname = req.body.nickname

    Accounts.exists({ _id: nickname }).then((is_exsisting) => {
      if (is_exsisting) {
        res.sendStatus(403)
      } else {
        const Promises = []

        Promises[0] = Accounts.create({
          _id: nickname,
          ...defaultAccountConfig,
        })

        Promises[1] = Levels.create({
          nickname,
          score: 0,
        })

        Promise.all(Promises).then(() => res.sendStatus(200))
        //  console.log("new account created")
      }
    })
  }

  getAccountProgress(req, res) {
    const nickname = req.body.nickname
    Accounts.findOne({ _id: nickname }, (err, account_data) => {
      //   console.log(nickname + "  Joined")
      res.status(200).json(account_data)
    })
      .lean()
      .select("-_id")
  }

  saveMoney(req, res) {
    const { money, nickname } = req.body

    Accounts.updateOne({ _id: nickname }, { money }, () => res.sendStatus(200))
  }

  saveNewSkin(req, res) {
    const nickname = req.body.nickname
    const [skin_part, skin_number] = [req.body.skin[0], req.body.skin[1]]
    const expression = {}
    expression[`skins.${skin_part}`] = skin_number

    Accounts.updateOne({ _id: nickname }, { $push: expression }, () =>
      res.sendStatus(200)
    )
  }

  equipSkin(req, res) {
    const { nickname, current_skins } = req.body
    Accounts.updateOne({ _id: nickname }, { current_skins }, () =>
      res.sendStatus(200)
    )
  }

  getAccountScores(req, res) {
    const { level, nickname } = req.body
    const query = { nickname }

    if (level) query.level = level
    //if level omitted, each level is found and returned

    Levels.find(query, (err, c) => res.json(c))
      .lean()
      .select("level score -_id")
  }
  postLevelScore(req, res) {
    const { score, nickname, level } = req.body
    const query = { nickname, level }
    const options = { upsert: true }
    const update = { score: score }

    //console.log(score,nickname,level)
    Levels.updateOne(query, update, options, () => res.sendStatus(200))
  }

  getTopScores(req, res) {
    const { level, players_amount } = req.body

    Levels.find({ level }, (err, players) => res.json(players))
      .sort({ score: -1 })
      .lean()
      .limit(players_amount)
      .select("score nickname -_id")
  }

  getRankFromScore(req, res) {
    const { level, score } = req.body
    //  console.time("time")
    Levels.countDocuments({ level, score: { $gt: score } }, (err, rank) =>
      res.json(rank + 1)
    )
    // await Levels.findOne({level,score:{$gte:score}},()=>{}).count()
    //  console.timeEnd("time")
    // res.sendStatus(200)
    //(err,count)=>console.log(count)
  }
}

mongoose.connection.on("error", (error) => {
  console.log("ERROR !", error)
  process.exit(1)
})

mongoose.connection.on("connected", function () {
  console.log("connected to mongo")
})

module.exports = DatabaseManager

/*
    const p = []
        for(let i =0,k=2;i<10000;i++,k++){
        
          if(k > 80){
            k=2;
          }
          p.push(Levels.create({
            level: k,
            nickname: "a"+k,
            rank: k,
            score_to_update: k,
            score: k,
          }))
        
         
        
        }
Promise.all(p).then(()=>console.log("done"))
*/

/*
   

 for(let i =0;i<3000;i++){
          Accounts.create({
            nickname:"afadg"+i,
            levels_scores:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            money:30300,
          })
          

  Accounts.create({
    nickname:"bffadg"+i,
    levels_scores:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    money:30300,
    
  })
}
 */
