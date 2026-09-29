"use strict"
// Socket.IO entry point for real-time 1v1 matches (server authoritative, see match.js).
const { Server } = require("socket.io")
const lobby = require("./lobby")
const { monitorLatency } = require("./latency")
const {
  asObject,
  asAck,
  sanitizeProfile,
  sanitizeTap,
  sanitizeDifficulty,
  sanitizeRoomCode,
} = require("./validation")

// an exception thrown from a socket.io listener would crash the whole process,
// one malformed message must never take the server down
const safe = (handler) => (...args) => {
  try {
    handler(...args)
  } catch (error) {
    console.error("multiplayer handler failed:", error)
  }
}

module.exports = function attachMultiplayer(httpServer) {
  const io = new Server(httpServer, {
    path: process.env.SOCKET_IO_PATH || "/socket.io",
    cors: { origin: "*" },
    pingInterval: 5000,
    pingTimeout: 5000,
  })

  io.on("connection", (socket) => {
    socket.data.room = null
    const stopLatencyMonitor = monitorLatency(socket)

    const on = (event, handler) => socket.on(event, safe(handler))

    // clock sync: the client estimates offset = serverTime - clientTime
    on("time:ping", (client_time, ack) => asAck(ack)({ clientTime: client_time, serverTime: Date.now() }))

    on("queue:join", (profile) => lobby.findMatch(socket, sanitizeProfile(profile)))

    on("queue:leave", () => lobby.leaveQueue(socket))

    on("room:create", (payload, ack) => {
      const { profile, difficulty } = asObject(payload)
      const code = lobby.openRoom(socket, sanitizeProfile(profile), sanitizeDifficulty(difficulty))
      asAck(ack)({ code })
    })

    on("room:join", (payload, ack) => {
      const { profile, code } = asObject(payload)
      asAck(ack)(lobby.joinRoom(socket, sanitizeProfile(profile), sanitizeRoomCode(code)))
    })

    on("room:leave", () => lobby.leave(socket))

    on("room:rematch", () => lobby.requestRematch(socket))

    // the only gameplay input a client can send
    on("tap", (tap) => lobby.tap(socket, sanitizeTap(tap)))

    on("disconnect", () => {
      stopLatencyMonitor()
      lobby.leave(socket, "disconnect")
    })
  })

  return io
}
