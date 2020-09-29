import { CREATE_ACCOUNT } from "./shortcuts/requests"
import { saveProgress } from "./shortcuts/save.js"
import { startGame } from "./index"

export default () => {
  const $ = (element) => {
    return document.querySelector(element)
  }
  const creator_div = $("#first-login")
  const nickname_input = $("#nickname-input")
  const accept_button = $("#accept-nickname")
  const info = $("#creating-info")

  creator_div.style.display = "block"

  accept_button.onclick = () => {
    info.innerHTML = "Creating account ..."

    CREATE_ACCOUNT({ nickname: nickname_input.value })
      .then((response) => {
        if (response.ok) {
          const removeWhiteSpaces = new RegExp("/s/g,")

          saveProgress({
            nickname: nickname_input.value.replace(removeWhiteSpaces, ""),
          })

          creator_div.style.display = "none"
          startGame()
        } else {
          info.innerHTML = "The nickname already exists"
        }
      })
      .catch(() => {
        if (!navigator.onLine) {
          info.innerHTML = "No internet connection"
        } else {
          info.innerHTML = "Something went wrong, try again later..."
        }
      })
  }
}
