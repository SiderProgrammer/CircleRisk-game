import { createTextButton } from "../GUI-helper"
import roomSettings from "../../multiplayer/room-settings"

const { OPTIONS, PRESETS, sanitizeSettings, findPreset, labelOf } = roomSettings

const STORAGE_KEY = "multiplayer_room_settings"
const MAX_ROW_HEIGHT = 86
const PRESET_COLOR = 0xf39c12
const STEP_COLOR = 0x2e86de

function loadSettings() {
  try {
    return sanitizeSettings(JSON.parse(localStorage.getItem(STORAGE_KEY)))
  } catch {
    return sanitizeSettings(null)
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {}
}

// values an option can take with the other current settings
function allowedValues(option, settings) {
  if (option.key !== "max_jump") return option.values
  return option.values.filter(({ value }) => value <= settings.targets - 1)
}

function cycle(list, index, direction) {
  return list[(index + direction + list.length) % list.length]
}

// Room setup screen: a preset row and one "< value >" stepper per setting.
// `elements` are the game objects to show / hide with the lobby state.
export default class RoomConfigurator {
  constructor(scene, top, bottom) {
    this.scene = scene
    this.settings = loadSettings()
    this.elements = []
    this.value_texts = {}

    const rows = OPTIONS.length + 1
    this.row_height = Math.min(MAX_ROW_HEIGHT, (bottom - top) / rows)
    this.font_size = Math.round(this.row_height * 0.4)
    const y = (row) => top + this.row_height * (row + 0.5)

    this.createRow(y(0), "PRESET", "preset", (direction) => this.stepPreset(direction), PRESET_COLOR)
    OPTIONS.forEach((option, index) =>
      this.createRow(y(index + 1), option.label, option.key, (direction) =>
        this.stepOption(option, direction)
      )
    )
    this.refresh()
  }

  createRow(y, label, key, onStep, color = STEP_COLOR) {
    const { GW } = this.scene.game
    const height = this.row_height - 8
    const button_size = Math.min(height, 70)

    const background = this.scene.add.graphics()
    background.fillStyle(0x000000, 0.25)
    background.fillRoundedRect(20, y - height / 2, GW - 40, height, 18)

    const title = this.scene.add
      .text(40, y, label, { font: `${this.font_size}px ${main_font}` })
      .setOrigin(0, 0.5)

    const value_x = GW - 205
    this.value_width = 270 - button_size - 16 // space between the two arrows
    const value = this.scene.add
      .text(value_x, y, "", { font: `${this.font_size}px ${main_font}` })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerup", () => onStep(1))
    this.value_texts[key] = value

    const stepButton = (x, text, direction) =>
      createTextButton(this.scene, x, y, text, () => onStep(direction), {
        width: button_size,
        height: button_size - 6,
        font_size: this.font_size + 6,
        color,
      })

    this.elements.push(
      background,
      title,
      value,
      stepButton(value_x - 135, "<", -1),
      stepButton(value_x + 135, ">", 1)
    )
  }

  stepPreset(direction) {
    const current = PRESETS.findIndex(({ name }) => name === this.presetName())
    // from a custom setup, ">" starts at the first preset and "<" at the last
    const index = current === -1 ? (direction > 0 ? -1 : 0) : current
    this.settings = { ...cycle(PRESETS, index, direction).settings }
    this.refresh()
  }

  stepOption(option, direction) {
    const values = allowedValues(option, this.settings)
    const index = values.findIndex(({ value }) => value === this.settings[option.key])
    this.settings = sanitizeSettings({
      ...this.settings,
      [option.key]: cycle(values, index, direction).value,
    })
    this.refresh()
  }

  presetName() {
    const preset = findPreset(this.settings)
    return preset ? preset.name : "CUSTOM"
  }

  setValue(key, label) {
    const text = this.value_texts[key].setScale(1).setText(label)
    text.setScale(Math.min(1, this.value_width / text.width)) // long labels shrink to fit
  }

  refresh() {
    this.setValue("preset", this.presetName())
    OPTIONS.forEach(({ key }) => this.setValue(key, labelOf(key, this.settings[key])))
    saveSettings(this.settings)
  }

  getSettings() {
    return { ...this.settings }
  }
}
