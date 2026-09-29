// Phaser has no text input, so float a DOM input above the canvas at a game position.
export default class CodeInput {
  constructor(scene, x, y, onSubmit) {
    this.scene = scene
    this.x = x
    this.y = y

    this.input = document.createElement("input")
    this.input.maxLength = 4
    this.input.autocomplete = "off"
    this.input.placeholder = "ABCD"
    this.input.addEventListener("keydown", (event) => event.key === "Enter" && onSubmit())
    document.body.appendChild(this.input)

    // the canvas is scaled to fit the window, keep the input over the same spot
    this.onResize = () => this.position()
    window.addEventListener("resize", this.onResize)
    this.position()
    this.input.focus()
  }

  get value() {
    return this.input.value.trim().toUpperCase()
  }

  position() {
    const rect = this.scene.game.canvas.getBoundingClientRect()
    const scale = rect.width / this.scene.game.GW
    const width = 360 * scale
    const height = 120 * scale

    Object.assign(this.input.style, {
      position: "absolute",
      left: `${rect.left + window.scrollX + this.x * scale - width / 2}px`,
      top: `${rect.top + window.scrollY + this.y * scale - height / 2}px`,
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
  }

  destroy() {
    window.removeEventListener("resize", this.onResize)
    this.input.remove()
  }
}
