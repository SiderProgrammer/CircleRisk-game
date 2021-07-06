"use strict"
// -------------- NOTE -------------
// SERVER AND CLIENT ARE NOT SECURED AT ANY WAY WITH HELMET MODULE FOR EXAMPLE
// THE GAME IS PRETTY SIMPLE AND I AM NOT AFRAID OF HACKERS IN THAT CASE

const compression = require("compression")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const socket = require("socket.io")

const customizeSkinsSetup = require("./settings/customize-skins-setup")
const levelsConfig = require("./settings/levels/levels-config")

const DatabaseManager = require("./database-manager")

const port = process.env.PORT || 3001
const host = "0.0.0.0"
const GAME_VERSION = 5

const server = express()
server.use(compression())
server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))

const databaseManager = new DatabaseManager()

server.get("/getGameVersion", (req, res) => res.json(GAME_VERSION))
server.get("/isServerAlive", (req, res) => res.sendStatus(200))

server.get("/getConfigurations", (req, res) =>
  res.send({ skins_setup: customizeSkinsSetup, levels_config: levelsConfig })
)

server.post("/createAccount", databaseManager.createAccount)

server.post("/saveMoney", databaseManager.saveMoney)

server.post("/saveNewSkin", databaseManager.saveNewSkin)

server.post("/equipSkin", databaseManager.equipSkin)

server.post("/getAccountProgress", databaseManager.getAccountProgress)

server.post("/getAccountScores", databaseManager.getAccountScores)

server.post("/getTopScores", databaseManager.getTopScores)

server.post("/getRankFromScore", databaseManager.getRankFromScore)

server.post("/postLevelScore", databaseManager.postLevelScore)

const app = server.listen(port, host, () => databaseManager.connectDatabase())

const io = socket(app, { cors: { origin: "*" } })

const rooms = []

function generateTargetsIndexes() {
  const indexes = [3]

  for (let i = 0; i < 50; i++) {
    const previousIndex = indexes[indexes.length - 1]
    let randomIndex = previousIndex + Math.floor(Math.random() * 3) + 1

    if (randomIndex > 8 - 1) {
      randomIndex -= 8
    }

    indexes.push(randomIndex)
  }

  return indexes
}

io.on("connection", function (socket) {
  console.log("a user connected")
  socket.on("disconnect", () => {
    console.log("remove room!")
    rooms.length = 0 // for now
  })
  socket.join("room-1")

  let room
  if (!rooms.find((room) => room.roomID === "room-1")) {
    console.log("new room")
    room = {
      roomID: "room-1",
      playersReady: 0,
    }

    rooms.push(room)
  } else {
    room = rooms.find((room) => room.roomID === "room-1")
  }

  socket.on("tap", (data) =>
    socket.broadcast.to("room-1").emit("opponentTap", data)
  )

  socket.on("die", () => socket.broadcast.to("room-1").emit("opponentDied"))
  socket.on("ready", () => {
    room.playersReady++
    console.log(room.playersReady)
    if (room.playersReady === 2) {
      room.playersReady = 0

      console.log("players are ready!")
      const initData = {
        targetsIndexes: generateTargetsIndexes(),
      }
      io.in("room-1").emit("start", initData)
    }
  })
})
