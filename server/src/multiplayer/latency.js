"use strict"
// Per-connection round trip estimate, used to size the lag compensation window:
// a tap may be judged up to `rewind` ms before it reached the server.

const PING_INTERVAL = 2000
const DEFAULT_RTT = 200
const MIN_REWIND = 50
const MAX_REWIND = 250
const REWIND_MARGIN = 50 // jitter allowance on top of half the round trip

function measure(socket) {
  const sent = Date.now()
  socket.timeout(PING_INTERVAL).emit("rtt:ping", (error) => {
    if (error) return
    const rtt = Date.now() - sent
    socket.data.rtt = socket.data.rtt * 0.7 + rtt * 0.3
  })
}

// returns a function stopping the measurements
function monitorLatency(socket) {
  socket.data.rtt = DEFAULT_RTT
  measure(socket)
  const interval = setInterval(() => measure(socket), PING_INTERVAL)
  return () => clearInterval(interval)
}

function getRewind(socket) {
  return Math.min(MAX_REWIND, Math.max(MIN_REWIND, socket.data.rtt / 2 + REWIND_MARGIN))
}

module.exports = { MAX_REWIND, monitorLatency, getRewind }
