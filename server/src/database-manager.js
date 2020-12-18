const mongoose = require("mongoose")

const srvConfig = require("./settings/db-config")
const { Accounts, Levels } = require("./settings/db-models")

const defaultAccountConfig = require("./settings/account-default-db")

const DATABASE_URL = `mongodb+srv://${srvConfig.USERNAME}:${srvConfig.PASSWORD}@${srvConfig.HOST}/${srvConfig.DB}?retryWrites=true&w=majority`

class DatabaseManager {
  constructor() {
  }
  connectDatabase() {


    mongoose.connect(
      DATABASE_URL,

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true,
        useFindAndModify:false,
       //  poolSize: 100
        // autoIndex: false,
      },
      () => {

        //   moongose.connection.close()
        // mongoose.disconnect();
        // // //   mongoose.connection.dropDatabase()

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

     
      }
    )
  }
  

  createAccount(req, res) {
    // use double destruction in req
    const nickname = req.body.nickname

    Accounts.exists({nickname})
    .then((is_exsisting) => {
      if (is_exsisting) {
        res.sendStatus(403)
      } else {
        Accounts.create( 
          {
            nickname,
            ...defaultAccountConfig,
          },
          () => res.sendStatus(200)

        )

        Levels.create({
          nickname,
          score:0,
        })
        console.log("new account created")
      }
    })
  }

  getAccountProgress(req, res) {
    const nickname = req.body.nickname
    Accounts.findOne({nickname},
      (err,account_data)=>{
        console.log(nickname + "  Joined")
        res.status(200).json(account_data)
      })
  }

  saveMoney(req, res) {
    const {money,nickname} = req.body;
   Accounts.findOneAndUpdate({nickname},{money}).exec(()=>res.sendStatus(200))
    
    }
  
    saveNewSkin(req, res) {
      const nickname = req.body.nickname
      const [skin_part,skin_number] = [req.body.skin[0],req.body.skin[1]]
      const expression = {}
      expression[`skins.${skin_part}`] = skin_number

      Accounts.findOneAndUpdate({nickname},{$push:expression}, () => res.sendStatus(200))
  
    }
  
    equipSkin(req, res) {
      const {nickname,current_skins} = req.body
      Accounts.findOneAndUpdate(
        { nickname},
        { current_skins}
      ).exec(()=>res.sendStatus(200))
       
    }

    getAccountScores(req,res){
      const nickname = req.body.nickname
    
      Levels.find({nickname},(err,c)=>{res.json(c);console.log(c)}).lean().select("level score -_id")
    }
    postLevelScore(req, res) {

      const { score, nickname, level } = req.body
      const query = {nickname, level}
      const options = { upsert: true}
      const update = {score:score}
  
//console.log(score,nickname,level)
      Levels.findOneAndUpdate(query, update, options,()=>res.sendStatus(200))
 
    }

    getTopScores(req,res){
      const {level,players_amount} =req.body

      Levels.find({level},
        (err,players)=>res.json(players))
      .sort({score:-1}).lean().limit(players_amount).select("score nickname -_id")
    }

// ---------
  getLevelScoreByNickname(req, res) {
    const { level, nickname } = req.body

  
    Levels.findOne({ nickname: nickname, level: level }).then((level) => {
      res.status(200).json(level)
    })
    
  }

  getLevelScoresAndNicknames(req, res) {

    const { start_search_rank, stop_search_rank, level } = req.body

    Levels.find({ level: level })
      .where("rank")
      .gt(start_search_rank - 1)
      .lt(stop_search_rank + 1)
      //  .lean()
      // .explain("executionStats")
      .then((levels) => {
        const sorted_levels = levels.sort((a, b) => a.rank - b.rank)
        res.status(200).json(sorted_levels)
      })
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
