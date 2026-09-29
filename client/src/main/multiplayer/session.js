// Long-lived multiplayer state shared by the lobby, level and result scenes.
// Scenes come and go (a launched scene only starts on the next frame), so the
// session is the single socket subscriber: it records the current match's events
// for replay and remembers room events a scene may have missed.
import { getSocket, getMyProfile } from "./connection"

const MATCH_EVENTS = ["player:state", "player:died", "match:end"]
const CONNECTION_EVENTS = ["connect", "connect_error"]

class MultiplayerSession {
  constructor() {
    this.listeners = {} // event -> handlers
    this.socket = getSocket()
    this.match = null // current match:start payload + its recorded events
    this.in_room = false // false after leaving: a late match:start is from a room we left
    this.opponent_left = false
    this.opponent_wants_rematch = false

    this.socket.on("match:start", (match) => this.onMatchStart(match))
    MATCH_EVENTS.forEach((event) =>
      this.socket.on(event, (data) => this.onMatchEvent(event, data))
    )
    this.socket.on("opponent:left", () => {
      this.opponent_left = true
      this.emit("opponent:left")
    })
    this.socket.on("opponent:rematch", () => {
      this.opponent_wants_rematch = true
      this.emit("opponent:rematch")
    })
    CONNECTION_EVENTS.forEach((event) => this.socket.on(event, () => this.emit(event)))
    this.socket.on("disconnect", () => {
      // the server drops us from any room or queue
      this.in_room = false
      this.emit("disconnect")
    })
  }

  get id() {
    return this.socket.id
  }

  get connected() {
    return this.socket.connected
  }

  onMatchStart(match) {
    if (!this.in_room) return
    this.match = { ...match, events: [] }
    this.opponent_left = false
    this.opponent_wants_rematch = false
    this.emit("match:start", this.match)
  }

  onMatchEvent(event, data) {
    if (!this.match) return
    this.match.events.push({ event, data })
    this.emit(event, data)
  }

  emit(event, data) {
    // copy: a handler may unbind listeners (e.g. by stopping its scene)
    ;(this.listeners[event] || []).slice().forEach((handler) => handler(data))
  }

  // listen for the lifetime of a scene
  bind(scene, handlers) {
    for (const event in handlers)
      this.listeners[event] = [...(this.listeners[event] || []), handlers[event]]

    scene.events.once("shutdown", () => {
      for (const event in handlers)
        this.listeners[event] = this.listeners[event].filter((h) => h !== handlers[event])
    })
  }

  // delivers the current match's events that happened before a scene was listening
  replayMatchEvents(handlers) {
    if (!this.match) return
    this.match.events.forEach(({ event, data }) => handlers[event] && handlers[event](data))
  }

  findMatch() {
    this.in_room = true
    this.socket.emit("queue:join", getMyProfile())
  }

  createRoom(difficulty, onCreated) {
    this.in_room = true
    this.socket.emit("room:create", { profile: getMyProfile(), difficulty }, ({ code }) =>
      onCreated(code)
    )
  }

  // match:start arrives before the reply when the room fills up
  joinRoom(code, onError) {
    this.in_room = true
    this.socket.emit("room:join", { profile: getMyProfile(), code }, ({ error }) => {
      if (!error) return
      if (!this.match) this.in_room = false
      onError(error)
    })
  }

  // leaves the queue or the room (and forfeits a running match)
  leave() {
    this.in_room = false
    this.match = null
    this.socket.emit("room:leave")
  }

  requestRematch() {
    this.socket.emit("room:rematch")
  }

  tap(seq, t) {
    this.socket.emit("tap", { seq, t })
  }
}

let session = null

export const getSession = () => session || (session = new MultiplayerSession())
