import { CREATE_ACCOUNT, IS_ONLINE,IS_SERVER_ALIVE } from "./shortcuts/requests"
import { saveProgress } from "./shortcuts/save.js"
import { startGame } from "../index"

const $ = (element) => {
  return document.querySelector(element)
}

const creator_div = $("#first-login")
const nickname_input = $("#nickname-input")
const accept_button = $("#accept-nickname")
const info = $("#creating-info")

const createAccount = () => {
 // const removeWhiteSpaces = new RegExp("/s/g,")

 saveProgress({
  nickname: nickname_input.value//.replace(removeWhiteSpaces, ""),
})

creator_div.style.display = "none"
}

const handleError = async () => {
  if (!(await IS_ONLINE())) {
    info.innerHTML =
      "Please check your internet connection and try again..."
      return
  }
if(!(await IS_SERVER_ALIVE())){
  info.innerHTML =
  "The game servers were down for maintenance. Try again later ..."
  return
}
 
"Something went wrong. Try again later ..."
}

const handleNewUser = (start_game_after_create) => {
if(start_game_after_create){
  createAccount()
  startGame()
}else{
  createAccount()
}
  
}

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

export default (start_game_after_create = true) => {
  creator_div.style.display = "block"

  accept_button.onclick = async () => {
    if (!VALIDATE_OK(nickname_input.value)) return
    
    info.innerHTML = "Creating account ..."
    await handleError()
    try {
      const response = await CREATE_ACCOUNT({
        nickname: nickname_input.value,
      })

      response.ok === true
        ? handleNewUser(start_game_after_create)
        : (info.innerHTML = "The nickname already exists")
    } catch {
        handleError()
      
    }
  }
}
