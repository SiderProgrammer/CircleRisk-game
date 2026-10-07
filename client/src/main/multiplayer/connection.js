// Socket connection and clock synchronisation with the multiplayer server.
// UMD build: the package's ESM entry uses syntax webpack 4 can't parse
import io from "socket.io-client/dist/socket.io.js"
import { SERVER_URL } from "../../config"

// SERVER_URL may live under a proxy sub-path (e.g. https://host/circleRiskTelegramApp),
// socket.io needs origin + path separately
const { origin, pathname } = new URL(SERVER_URL)
const SOCKET_PATH = `${pathname.replace(/\/$/, "")}/socket.io`

const CLOCK_SAMPLES = 8 // recent measurements kept
const CLOCK_SYNC_INTERVAL = 10000

let socket = null
let clock_offset = 0 // serverTime - clientTime
let clock_samples = []

function measureClock() {
  const sent = Date.now()
  socket.emit("time:ping", sent, ({ serverTime }) => {
    const now = Date.now()
    const rtt = now - sent
    clock_samples = [...clock_samples, { rtt, offset: serverTime + rtt / 2 - now }].slice(
      -CLOCK_SAMPLES
    )
    // the recent sample with the lowest round trip is the most precise one;
    // using only recent ones lets the offset follow device clock adjustments
    const best = clock_samples.reduce((a, b) => (b.rtt < a.rtt ? b : a))
    clock_offset = best.offset
  })
}

export function getSocket() {
  if (socket) return socket

  socket = io(origin, { path: SOCKET_PATH, transports: ["websocket", "polling"] })

  // the server measures our round trip to size its lag compensation window
  socket.on("rtt:ping", (ack) => typeof ack === "function" && ack())

  socket.on("connect", () => {
    clock_samples = []
    for (let i = 0; i < 5; i++) setTimeout(measureClock, i * 200)
  })
  setInterval(() => socket.connected && measureClock(), CLOCK_SYNC_INTERVAL)

  // close cleanly so the opponent is told right away instead of after the heartbeat timeout
  window.addEventListener("pagehide", () => socket.disconnect())
  // a manual disconnect disables auto reconnection, restore it when the page comes back
  window.addEventListener("pageshow", ({ persisted }) => persisted && socket.connect())

  return socket
}

export const serverNow = () => Date.now() + clock_offset

export const getMyProfile = () => ({
  nickname: window.my_nickname,
  skins: window.progress ? window.progress.current_skins : {},
})
