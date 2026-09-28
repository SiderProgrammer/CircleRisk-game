import {
  createBackground,
  createButton,
  createTextButton,
  createFetchingAnimation,
} from "../GUI-helper"
import { getSocket, getMyProfile } from "../../shortcuts/multiplayer-socket"

const DIFFICULTIES = ["easy", "medium", "hard"]
const DIFFICULTY_COLORS = { easy: 0x27ae60, medium: 0xe67e22, hard: 0xc0392b }

export default class MultiplayerLobby extends Phaser.Scene {
  constructor() {
    super("multiplayerLobby")
  }

  init() {
    this.socket = getSocket()
    this.difficulty_index = 0
    this.states = {}
    this.spinner = null
    this.code_input = null
  }

  create() {
    const { GW, GH } = this.game
    this.center_y = GH / 2

    createBackground(this, "menu-bg")
    this.add
      .text(GW / 2, 170, "1 VS 1", { font: `120px ${main_font}` })
      .setOrigin(0.5)

    this.status_text = this.add
      .text(GW / 2, 300, "", {
        font: `40px ${main_font}`,
        align: "center",
        wordWrap: { width: GW * 0.85 },
      })
      .setOrigin(0.5)

    createButton(this, 20, 20, "back-button", () => this.backToMenu(), "button")
      .setOrigin(0)

    this.createMainState()
    this.createSearchingState()
    this.createRoomState()
    this.createJoinState()

    this.bindSocketEvents()
    this.setState("main")

    this.cameras.main.setAlpha(0)
    this.tweens.add({ targets: this.cameras.main, alpha: 1, duration: 250 })
  }

  createMainState() {
    const { GW } = this.game
    const y = this.center_y

    const difficulty_button = createTextButton(this, GW / 2, y + 330, "", () => {
      this.difficulty_index = (this.difficulty_index + 1) % DIFFICULTIES.length
      updateDifficulty()
    }, { width: 420, height: 90, font_size: 38 })

    const updateDifficulty = () => {
      const difficulty = DIFFICULTIES[this.difficulty_index]
      difficulty_button.text.setText(`ROOM LEVEL: ${difficulty.toUpperCase()}`)
      difficulty_button.setColor(DIFFICULTY_COLORS[difficulty])
    }
    updateDifficulty()

    this.states.main = [
      createTextButton(this, GW / 2, y - 180, "FIND MATCH", () => this.findMatch(), {
        color: 0xf39c12,
        width: 520,
        height: 130,
        font_size: 60,
      }),
      createTextButton(this, GW / 2, y, "CREATE ROOM", () => this.createRoom()),
      createTextButton(this, GW / 2, y + 150, "JOIN ROOM", () => this.setState("join")),
      difficulty_button,
    ]
  }

  createSearchingState() {
    this.states.searching = [
      createTextButton(this, this.game.GW / 2, this.center_y + 250, "CANCEL", () => {
        this.socket.emit("queue:leave")
        this.setState("main")
      }, { color: 0x7f8c8d }),
    ]
  }

  createRoomState() {
    const { GW } = this.game
    this.room_code_text = this.add
      .text(GW / 2, this.center_y - 60, "", { font: `160px ${main_font}` })
      .setOrigin(0.5)

    this.states.room = [
      this.add
        .text(GW / 2, this.center_y - 200, "ROOM CODE", { font: `50px ${main_font}` })
        .setOrigin(0.5),
      this.room_code_text,
      createTextButton(this, GW / 2, this.center_y + 250, "CANCEL", () => {
        this.socket.emit("room:leave")
        this.setState("main")
      }, { color: 0x7f8c8d }),
    ]
  }

  createJoinState() {
    const { GW } = this.game
    this.states.join = [
      this.add
        .text(GW / 2, this.center_y - 200, "ENTER ROOM CODE", { font: `50px ${main_font}` })
        .setOrigin(0.5),
      createTextButton(this, GW / 2, this.center_y + 100, "JOIN", () => this.joinRoom(), {
        color: 0x27ae60,
      }),
      createTextButton(this, GW / 2, this.center_y + 250, "CANCEL", () => this.setState("main"), {
        color: 0x7f8c8d,
      }),
    ]
  }

  setState(name) {
    this.state = name
    for (const state in this.states)
      this.states[state].forEach((element) => {
        element.setVisible(state === name)
        if (element.input) element.input.enabled = state === name
      })

    if (this.spinner) {
      this.spinner.stop()
      this.spinner = null
    }
    if (name === "searching" || name === "room")
      this.spinner = createFetchingAnimation(this, this.game.GW / 2, this.center_y + 110)

    name === "join" ? this.showCodeInput() : this.removeCodeInput()

    const messages = {
      main: this.socket.connected ? "" : "Connecting to server...",
      searching: "Searching for an opponent...",
      room: "Share this code with a friend",
      join: "",
    }
    this.status_text.setText(messages[name])
  }

  // Phaser has no text input, so float a DOM input above the canvas
  showCodeInput() {
    if (this.code_input) return
    const rect = this.game.canvas.getBoundingClientRect()
    const scale = rect.width / this.game.GW
    const width = 360 * scale
    const height = 120 * scale

    const input = document.createElement("input")
    input.maxLength = 4
    input.autocomplete = "off"
    input.placeholder = "ABCD"
    Object.assign(input.style, {
      position: "absolute",
      left: `${rect.left + window.scrollX + (this.game.GW / 2) * scale - width / 2}px`,
      top: `${rect.top + window.scrollY + (this.center_y - 60) * scale - height / 2}px`,
      width: `${width}px`,
      height: `${height}px`,
      fontSize: `${80 * scale}px`,
      fontFamily: main_font,
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: `${10 * scale}px`,
      border: "none",
      borderRadius: `${20 * scale}px`,
      outline: "none",
      zIndex: 10,
    })
    input.addEventListener("keydown", (event) => event.key === "Enter" && this.joinRoom())
    document.body.appendChild(input)
    input.focus()
    this.code_input = input
  }

  removeCodeInput() {
    if (!this.code_input) return
    this.code_input.remove()
    this.code_input = null
  }

  findMatch() {
    this.socket.emit("queue:join", getMyProfile())
    this.setState("searching")
  }

  createRoom() {
    this.room_code_text.setText("")
    this.setState("room")
    this.socket.emit(
      "room:create",
      { profile: getMyProfile(), difficulty: DIFFICULTIES[this.difficulty_index] },
      ({ code }) => this.room_code_text.setText(code)
    )
  }

  joinRoom() {
    if (!this.code_input) return
    const code = this.code_input.value.trim().toUpperCase()
    if (code.length !== 4) return this.status_text.setText("Code has 4 letters")

    this.status_text.setText("Joining...")
    this.socket.emit("room:join", { profile: getMyProfile(), code }, ({ error }) => {
      if (error && this.state === "join") this.status_text.setText(error)
    })
  }

  bindSocketEvents() {
    const handlers = {
      "match:start": (match) => this.startMatch(match),
      connect: () => this.state === "main" && this.status_text.setText(""),
      connect_error: () =>
        this.state === "main" && this.status_text.setText("Can't reach the server..."),
      disconnect: () => this.state !== "main" && this.setState("main"),
    }
    for (const event in handlers) this.socket.on(event, handlers[event])

    this.events.once("shutdown", () => {
      for (const event in handlers) this.socket.off(event, handlers[event])
      this.removeCodeInput()
    })
  }

  startMatch(match) {
    this.game.audio.sounds.start_sound.play()
    this.scene.sleep("menu")
    this.scene.launch("Multiplayer_Basic", match)
    this.scene.stop()
  }

  backToMenu() {
    this.socket.emit("room:leave")
    this.scene.stop()
    this.scene.get("menu").animateShowMenu()
  }
}
