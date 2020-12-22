"use strict"
const compression = require("compression")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const cluster = require("cluster")
const os = require("os")

const customizeSkinsSetup = require("./settings/customize-skins-setup")
const levelsConfig = require("./settings/levels/levels-config")

const DatabaseManager = require("./database-manager")

const port = process.env.PORT || 3001
const host = "0.0.0.0"

const server = express()
server.use(compression())
server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))


const databaseManager = new DatabaseManager()

server.get("/isServerAlive", (req, res) => res.sendStatus(200))

server.post("/createAccount", (req, res) =>
  databaseManager.createAccount(req, res)
)

server.post("/saveMoney", (req, res) => {
  databaseManager.saveMoney(req, res)
})

server.post("/saveNewSkin", (req, res) => {
  databaseManager.saveNewSkin(req, res)
})

server.post("/equipSkin", (req, res) => {
  databaseManager.equipSkin(req, res)
})

server.post("/getAccountProgress", (req, res) =>
  databaseManager.getAccountProgress(req, res)
)

server.post("/getAccountScores", (req, res) =>
  databaseManager.getAccountScores(req, res)
)

server.post("/getTopScores", (req, res) =>
  databaseManager.getTopScores(req, res)
)

server.post("/getRankFromScore", (req, res) =>
  databaseManager.getRankFromScore(req, res)
)

server.post("/postLevelScore", (req, res) => {
  databaseManager.postLevelScore(req, res)
})

server.get("/getConfigurations", (req, res) =>
  res.send({ skins_setup: customizeSkinsSetup, levels_config: levelsConfig })
)
const numCPUs = os.cpus().length

if(cluster.isMaster){
  for(let i=0;i<numCPUs;++i){
    cluster.fork()
    
  }
  
}else{

}

cluster.on("exit",()=>{
  cluster.fork()
})
server.listen(port, host, () => databaseManager.connectDatabase())
