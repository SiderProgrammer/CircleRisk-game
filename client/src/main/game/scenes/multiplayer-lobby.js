import {
  createBackground,
  createButton,
  createTextButton,
  createFetchingAnimation,
} from "../GUI-helper"
import CodeInput from "../multiplayer/code-input"
import RoomConfigurator from "../multiplayer/room-configurator"
import { getSession } from "../../multiplayer/session"
import roomSettings from "../../multiplayer/room-settings"

const GREY = 0x7f8c8d
const GREEN = 0x27ae60

const STATUS_TEXTS = {
  searching: "Searching for an opponent...",
  room: "Share this code with a friend",
  join: "",
  setup: "",
}

// Find a random opponent, or set up / join a room with a 4-letter code.
export default class MultiplayerLobby extends Phaser.Scene {
  constructor() {
    super("multiplayerLobby")
  }

  init() {
    this.session = getSession()
    this.states = {}
    this.state = null
    this.spinner = null
    this.code_input = null
  }

  create() {
    const { GW, GH } = this.game
    this.center_y = GH / 2

    createBackground(this, "menu-bg")
    this.title = this.add.text(GW / 2, 170, "1 VS 1", { font: `120px ${main_font}` }).setOrigin(0.5)
    this.status_text = this.add
      .text(GW / 2, 300, "", {
        font: `40px ${main_font}`,
        align: "center",
        wordWrap: { width: GW * 0.85 },
      })
      .setOrigin(0.5)
    createButton(this, 20, 20, "back-button", () => this.back(), "button").setOrigin(0)

    this.createMainState()
    this.createSetupState()
    this.createSearchingState()
    this.createRoomState()
    this.createJoinState()

    this.session.bind(this, {
      "match:start": (match) => this.startMatch(match),
      connect: () => this.state === "main" && this.status_text.setText(""),
      connect_error: () =>
        this.state === "main" && this.status_text.setText("Can't reach the server..."),
      disconnect: () => this.state !== "setup" && this.setState("main"),
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

    this.states.main = [
      createTextButton(this, GW / 2, y - 180, "FIND MATCH", () => this.findMatch(), {
        color: 0xf39c12,
        width: 520,
        height: 130,
        font_size: 60,
      }),
      createTextButton(this, GW / 2, y, "CREATE ROOM", () => this.setState("setup")),
      createTextButton(this, GW / 2, y + 150, "JOIN ROOM", () => this.setState("join")),
    ]
  }

  // the room configurator takes the whole screen below the back button
  createSetupState() {
    const { GW, GH } = this.game
    this.configurator = new RoomConfigurator(this, 135, GH - 175)
    this.states.setup = [
      ...this.configurator.elements,
      createTextButton(this, GW / 2, GH - 95, "CREATE ROOM", () => this.createRoom(), {
        color: GREEN,
        width: 520,
        height: 120,
        font_size: 56,
      }),
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
    this.room_settings_text = this.add
      .text(GW / 2, this.center_y + 370, "", {
        font: `30px ${main_font}`,
        align: "center",
        wordWrap: { width: GW * 0.85 },
      })
      .setOrigin(0.5)

    this.states.room = [
      this.add.text(GW / 2, this.center_y - 200, "ROOM CODE", { font: `50px ${main_font}` }).setOrigin(0.5),
      this.room_code_text,
      this.room_settings_text,
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
        color: GREEN,
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

    // the setup screen needs the room the title takes
    this.title.setVisible(name !== "setup")

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
    const settings = this.configurator.getSettings()
    this.room_code_text.setText("")
    this.room_settings_text.setText(roomSettings.describeSettings(settings))
    this.setState("room")
    this.session.createRoom(settings, (code) => this.room_code_text.setText(code))
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

  // the arrow goes one screen back: from a sub-screen to the lobby, from the lobby to the menu
  back() {
    if (this.state !== "main") return this.cancel()
    this.session.leave()
    this.scene.stop()
    this.scene.get("menu").animateShowMenu()
  }
}
