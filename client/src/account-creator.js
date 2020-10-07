import { CREATE_ACCOUNT,IS_ONLINE } from "./shortcuts/requests"
import { saveProgress } from "./shortcuts/save.js"
import { startGame } from "./index"

const $ = (element) => {
  return document.querySelector(element)
}

const creator_div = $("#first-login")
const nickname_input = $("#nickname-input")
const accept_button = $("#accept-nickname")
const info = $("#creating-info")

const createAccountAndStartGame = () => {
  const removeWhiteSpaces = new RegExp("/s/g,")

  saveProgress({
    nickname: nickname_input.value.replace(removeWhiteSpaces, ""),
  })

  creator_div.style.display = "none"
  startGame()
}

const handleError = async () => {
    if (!await IS_ONLINE()) {
      info.innerHTML = "No internet connection"
    } else {
      info.innerHTML = "Something went wrong, try again later..."
    }
  
}

export default () => {
  creator_div.style.display = "block"

  accept_button.onclick = async () => {
    info.innerHTML = "Creating account ..."
    try {
      const response = await CREATE_ACCOUNT({
        nickname: nickname_input.value,
      })

      response.ok === true
        ? createAccountAndStartGame()
        : (info.innerHTML = "The nickname already exists")
    } catch {
      handleError()
    }
  }
}
