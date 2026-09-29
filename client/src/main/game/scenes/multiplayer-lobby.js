import {
  createBackground,
  createButton,
  createTextButton,
  createFetchingAnimation,
} from "../GUI-helper"
import CodeInput from "../multiplayer/code-input"
import { getSession } from "../../multiplayer/session"

const DIFFICULTIES = ["easy", "medium", "hard"]
const DIFFICULTY_COLORS = { easy: 0x27ae60, medium: 0xe67e22, hard: 0xc0392b }
const GREY = 0x7f8c8d

const STATUS_TEXTS = {
  searching: "Searching for an opponent...",
  room: "Share this code with a friend",
  join: "",
}

// Find a random opponent, or create / join a room with a 4-letter code.
export default class MultiplayerLobby extends Phaser.Scene {
  constructor() {
    super("multiplayerLobby")
  }

  init() {
    this.session = getSession()
    this.difficulty_index = 0
    this.states = {}
    this.state = null
    this.spinner = null
    this.code_input = null
  }

  create() {
    const { GW, GH } = this.game
    this.center_y = GH / 2

    createBackground(this, "menu-bg")
    this.add.text(GW / 2, 170, "1 VS 1", { font: `120px ${main_font}` }).setOrigin(0.5)
    this.status_text = this.add
      .text(GW / 2, 300, "", {
        font: `40px ${main_font}`,
        align: "center",
        wordWrap: { width: GW * 0.85 },
      })
      .setOrigin(0.5)
    createButton(this, 20, 20, "back-button", () => this.backToMenu(), "button").setOrigin(0)

    this.createMainState()
    this.createSearchingState()
    this.createRoomState()
    this.createJoinState()

    this.session.bind(this, {
      "match:start": (match) => this.startMatch(match),
      connect: () => this.state === "main" && this.status_text.setText(""),
      connect_error: () =>
        this.state === "main" && this.status_text.setText("Can't reach the server..."),
      disconnect: () => this.setState("main"),
    })
    // game objects are destroyed with the scene, the DOM input isn't
    this.events.once("shutdown", () => this.code_input && this.code_input.destroy())
    this.setState("main")

    this.cameras.main.setAlpha(0)
    this.tweens.add({ targets: this.cameras.main, alpha: 1, duration: 250 })
  }

  createMainState() {
    const { GW } = this.game
    const y = this.center_y

    const difficulty_button = createTextButton(
      this,
      GW / 2,
      y + 330,
      "",
      () => {
        this.difficulty_index = (this.difficulty_index + 1) % DIFFICULTIES.length
        updateDifficulty()
      },
      { width: 420, height: 90, font_size: 38 }
    )
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

  createCancelButton() {
    return createTextButton(this, this.game.GW / 2, this.center_y + 250, "CANCEL", () => this.cancel(), {
      color: GREY,
    })
  }

  createSearchingState() {
    this.states.searching = [this.createCancelButton()]
  }

  createRoomState() {
    const { GW } = this.game
    this.room_code_text = this.add
      .text(GW / 2, this.center_y - 60, "", { font: `160px ${main_font}` })
      .setOrigin(0.5)

    this.states.room = [
      this.add.text(GW / 2, this.center_y - 200, "ROOM CODE", { font: `50px ${main_font}` }).setOrigin(0.5),
      this.room_code_text,
      this.createCancelButton(),
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
      this.createCancelButton(),
    ]
  }

  setState(name) {
    this.state = name
    for (const state in this.states)
      this.states[state].forEach((element) => {
        element.setVisible(state === name)
        if (element.input) element.input.enabled = state === name
      })

    if (this.spinner) this.spinner.stop()
    this.spinner =
      name === "searching" || name === "room"
        ? createFetchingAnimation(this, this.game.GW / 2, this.center_y + 110)
        : null

    if (this.code_input) this.code_input.destroy()
    this.code_input =
      name === "join" ? new CodeInput(this, this.game.GW / 2, this.center_y - 60, () => this.joinRoom()) : null

    this.status_text.setText(
      name === "main" ? (this.session.connected ? "" : "Connecting to server...") : STATUS_TEXTS[name]
    )
  }

  findMatch() {
    this.session.findMatch()
    this.setState("searching")
  }

  createRoom() {
    this.room_code_text.setText("")
    this.setState("room")
    this.session.createRoom(DIFFICULTIES[this.difficulty_index], (code) =>
      this.room_code_text.setText(code)
    )
  }

  joinRoom() {
    const code = this.code_input && this.code_input.value
    if (!code) return
    if (code.length !== 4) return this.status_text.setText("Code has 4 letters")

    this.status_text.setText("Joining...")
    this.session.joinRoom(code, (error) => this.state === "join" && this.status_text.setText(error))
  }

  cancel() {
    this.session.leave()
    this.setState("main")
  }

  startMatch(match) {
    this.game.audio.sounds.start_sound.play()
    this.scene.sleep("menu")
    this.scene.launch("Multiplayer_Basic", match)
    this.scene.stop()
  }

  backToMenu() {
    this.session.leave()
    this.scene.stop()
    this.scene.get("menu").animateShowMenu()
  }
}
