// UMD build: the package's ESM entry uses syntax webpack 4 can't parse
import io from "socket.io-client/dist/socket.io.js"
import { SERVER_URL } from "../../config"

// SERVER_URL may live under a proxy sub-path (e.g. https://host/circleRiskTelegramApp),
// socket.io needs origin + path separately
const { origin, pathname } = new URL(SERVER_URL)
const SOCKET_PATH = `${pathname.replace(/\/$/, "")}/socket.io`

let socket = null
let clock_offset = 0 // serverTime - clientTime
let best_rtt = Infinity

function measureClock() {
  const sent = Date.now()
  socket.emit("time:ping", sent, ({ serverTime }) => {
    const now = Date.now()
    const rtt = now - sent
    // keep the sample with the lowest round trip, it is the most precise one
    if (rtt <= best_rtt) {
      best_rtt = rtt
      clock_offset = serverTime + rtt / 2 - now
    }
  })
}

export function getSocket() {
  if (socket) return socket

  socket = io(origin, {
    path: SOCKET_PATH,
    transports: ["websocket", "polling"],
  })

  // the server measures our round trip to size its lag compensation window
  socket.on("rtt:ping", (ack) => typeof ack === "function" && ack())

  socket.on("connect", () => {
    best_rtt = Infinity
    for (let i = 0; i < 5; i++) setTimeout(measureClock, i * 200)
  })
  // re-sync from time to time, network conditions change
  setInterval(() => socket.connected && measureClock(), 10000)
  // close cleanly so the opponent is told right away instead of after the heartbeat timeout
  window.addEventListener("pagehide", () => socket.disconnect())

  return socket
}

export const serverNow = () => Date.now() + clock_offset

export const getMyProfile = () => ({
  nickname: window.my_nickname,
  skins: window.progress ? window.progress.current_skins : {},
})
