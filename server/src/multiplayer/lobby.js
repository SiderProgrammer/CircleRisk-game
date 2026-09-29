"use strict"
// Rooms (joined by a 4-letter code or created by the random queue) and matchmaking.
const levelsConfig = require("../settings/levels/levels-config")
const Match = require("./match")
const { DIFFICULTIES } = require("./validation")

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ" // no I / O to avoid confusion

const rooms = new Map() // code -> room
const queue = [] // sockets waiting for a random opponent

function getBasicLevel(difficulty) {
  const index = levelsConfig.findIndex(
    ({ info }) => info.name === "basic" && info.difficulty === difficulty
  )
  return { level: index + 1, difficulty, ...levelsConfig[index] }
}

function generateCode() {
  let code
  do {
    code = ""
    for (let i = 0; i < 4; i++)
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  } while (rooms.has(code))
  return code
}

// difficulty null: random for every match (queue rooms)
function createRoom(difficulty) {
  const room = { code: generateCode(), difficulty, sockets: [], match: null, rematch: new Set() }
  rooms.set(room.code, room)
  return room
}

function getRoom(socket) {
  return rooms.get(socket.data.room)
}

function startMatch(room) {
  const difficulty =
    room.difficulty || DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)]
  room.rematch.clear()
  room.match = new Match(room.sockets.slice(), getBasicLevel(difficulty))
  room.match.start()
}

function addToRoom(socket, room) {
  room.sockets.push(socket)
  socket.data.room = room.code
  if (room.sockets.length === 2) startMatch(room)
}

function leaveQueue(socket) {
  const index = queue.indexOf(socket)
  if (index !== -1) queue.splice(index, 1)
}

// leaves the queue and the current room; leaving during a match loses it
function leave(socket, reason = "left") {
  leaveQueue(socket)
  const room = getRoom(socket)
  socket.data.room = null
  if (!room) return

  if (room.match) room.match.forfeit(socket, reason)
  room.sockets = room.sockets.filter((other) => other !== socket)
  room.rematch.delete(socket.id)

  if (room.sockets.length === 0) return rooms.delete(room.code)
  room.sockets.forEach((other) => other.emit("opponent:left"))
}

function findMatch(socket, profile) {
  leave(socket)
  socket.data.profile = profile

  const opponent = queue.shift()
  if (!opponent) return queue.push(socket)

  const room = createRoom(null)
  addToRoom(opponent, room)
  addToRoom(socket, room)
}

function openRoom(socket, profile, difficulty) {
  leave(socket)
  socket.data.profile = profile
  const room = createRoom(difficulty)
  addToRoom(socket, room)
  return room.code
}

function joinRoom(socket, profile, code) {
  const room = rooms.get(code)
  if (!room) return { error: "Room not found" }
  if (room.sockets.includes(socket)) return { error: "That's your own room" }
  if (room.sockets.length >= 2) return { error: "Room is full" }

  leave(socket)
  socket.data.profile = profile
  addToRoom(socket, room)
  return { code }
}

function requestRematch(socket) {
  const room = getRoom(socket)
  if (!room || !room.match || !room.match.ended) return

  room.rematch.add(socket.id)
  room.sockets.forEach((other) => other !== socket && other.emit("opponent:rematch"))
  if (room.sockets.length === 2 && room.rematch.size === 2) startMatch(room)
}

function tap(socket, tap_data) {
  const room = getRoom(socket)
  if (room && room.match) room.match.handleTap(socket, tap_data)
}

module.exports = { findMatch, leaveQueue, openRoom, joinRoom, leave, requestRematch, tap }
