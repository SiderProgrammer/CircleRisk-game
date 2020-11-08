import { CREATE_ACCOUNT, IS_ONLINE } from "./shortcuts/requests"
import { saveProgress } from "./shortcuts/save.js"
import { startGame } from "../index"

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
/*
const handleError = async () => {
  if (!(await IS_ONLINE())) {
    info.innerHTML =
      "Oops... Something went wrong. Check your internet connection or try again later."
  }
}
*/

const VALIDATE_OK = (string) => {
  const VALIDATE_REGEXP = /^[a-z0-9wа-я]+$/i
  const MIN_NICKNAME_LENGTH = 1

  let characters_test = VALIDATE_REGEXP.test(string)

  if (string.length < MIN_NICKNAME_LENGTH) {
    info.innerHTML = `You need at least ${MIN_NICKNAME_LENGTH} character`
    return false
  }

  if (!characters_test) {
    info.innerHTML = "Remove special characters please"
    return false
  }

  return true
}

export default () => {
  creator_div.style.display = "block"

  accept_button.onclick = async () => {
    if (!VALIDATE_OK(nickname_input.value)) return

    info.innerHTML = "Creating account ..."

    try {
      const response = await CREATE_ACCOUNT({
        nickname: nickname_input.value,
      })

      response.ok === true
        ? createAccountAndStartGame()
        : (info.innerHTML = "The nickname already exists")
    } catch {
      //  handleError()
      info.innerHTML =
        "Oops... Something went wrong. Check your internet connection or try again later."
    }
  }
}
