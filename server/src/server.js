"use strict"
// -------------- NOTE -------------
// SERVER AND CLIENT ARE NOT SECURED AT ANY WAY WITH HELMET MODULE FOR EXAMPLE
// THE GAME IS PRETTY SIMPLE AND I AM NOT AFRAID OF HACKERS IN THAT CASE

const compression = require("compression")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const customizeSkinsSetup = require("./settings/customize-skins-setup")
const levelsConfig = require("./settings/levels/levels-config")

const DatabaseManager = require("./database-manager")

const port = process.env.PORT || 3001
const host = "0.0.0.0"
const GAME_VERSION = 5;

  const server = express()
  server.use(compression())
  server.use(cors())
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: false }))
  

  const databaseManager = new DatabaseManager()
  

  server.get("/getGameVersion",(req,res)=> res.json(GAME_VERSION));
  server.get("/isServerAlive", (req, res) => res.sendStatus(200));
  
  server.get("/getConfigurations", (req, res) =>
  res.send({ skins_setup: customizeSkinsSetup, levels_config: levelsConfig })
)

  server.post("/createAccount",databaseManager.createAccount)
  
  server.post("/saveMoney",databaseManager.saveMoney)
  
  server.post("/saveNewSkin",databaseManager.saveNewSkin)
  
  server.post("/equipSkin",databaseManager.equipSkin)
  
  server.post("/getAccountProgress",databaseManager.getAccountProgress)
  
  server.post("/getAccountScores",databaseManager.getAccountScores)
  
  server.post("/getTopScores",databaseManager.getTopScores)
  
  server.post("/getRankFromScore",databaseManager.getRankFromScore)
  
  server.post("/postLevelScore",databaseManager.postLevelScore)
  
  server.listen(port, host, () => databaseManager.connectDatabase())
  

 

