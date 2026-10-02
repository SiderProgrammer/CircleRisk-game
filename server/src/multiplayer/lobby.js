"use strict"
// Rooms (joined by a 4-letter code or created by the random queue) and matchmaking.
const Match = require("./match")
const { CLASSIC_PRESETS } = require("../shared/room-settings")

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ" // no I / O to avoid confusion

const rooms = new Map() // code -> room
const queue = [] // sockets waiting for a random opponent

function randomClassicSettings() {
  return CLASSIC_PRESETS[Math.floor(Math.random() * CLASSIC_PRESETS.length)].settings
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

// settings null: a random classic preset for every match (queue rooms)
function createRoom(settings) {
  const room = { code: generateCode(), settings, sockets: [], match: null, rematch: new Set() }
  rooms.set(room.code, room)
  return room
}

function getRoom(socket) {
  return rooms.get(socket.data.room)
}

function startMatch(room) {
  room.rematch.clear()
  room.match = new Match(room.sockets.slice(), room.settings || randomClassicSettings())
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

// settings: already sanitized room settings (shared/room-settings.js)
function openRoom(socket, profile, settings) {
  leave(socket)
  socket.data.profile = profile
  const room = createRoom(settings)
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
