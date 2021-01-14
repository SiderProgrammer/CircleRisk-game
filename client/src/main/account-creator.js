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
  nickname: nickname_input.value,//.replace(removeWhiteSpaces, ""),
  is_first_game:true,
  rated_the_game:false,
})

creator_div.style.display = "none"
}

const handleError = async () => {
  if (!(await IS_ONLINE())) {
    info.innerHTML =
      "Please check your internet connection and try again..."
      return false
  }
if(!(await IS_SERVER_ALIVE())){
  info.innerHTML =
  "The game servers were down for maintenance. Try again later ..."
  return false
}
 return true; 
//info.innerHTML = "Something went wrong. Try again later ..."
}

const handleNewUser = (start_game_after_create) => {
  
if(start_game_after_create){
  createAccount()
  startGame()
}else{
  const canvas = $("canvas")  
  canvas.style.display = "block";

  createAccount()
}
  
}

const VALIDATE_OK = (string) => {
  const VALIDATE_REGEXP = /^[a-z0-9wа-я _]+$/i
  //const VALIDATE_REGEXP = /^[a-ząćęłńóśźż0-9wа-я _]+$/i
  const MIN_NICKNAME_LENGTH = 3

  let characters_test = VALIDATE_REGEXP.test(string)

  if (string.length < MIN_NICKNAME_LENGTH) {
    info.innerHTML = `You need at least ${MIN_NICKNAME_LENGTH} character`
    return false
  }

  if (!characters_test) {
    info.innerHTML = "Remove special characters please"
    return false
  }

  if(string[0] === " "){
    info.innerHTML = "Space can not be first character"
    return false;
  }

  
  return true
}

export default (start_game_after_create = true) => {

  const canvas = $("canvas")  
  if(canvas)canvas.style.display = "none";

 const div_to_move = $("#creating-info-div")
const profile_guy =  $("#profile-guy");

const centered_height = window.getComputedStyle(div_to_move).getPropertyValue("height")
let to_reset = false;

nickname_input.addEventListener("focus",()=>{
  div_to_move.style.height = "80px"
  profile_guy.style.display = "none";
  to_reset = false;
})
nickname_input.addEventListener("blur",()=>{
  to_reset = true;
})

creator_div.style.display = "block"

let is_button_clicked = false;

  accept_button.onclick = async () => {
  if(is_button_clicked) return

  is_button_clicked = true;

    if(to_reset){
      div_to_move.style.height = centered_height
      profile_guy.style.display = "block"
    }

    if (!VALIDATE_OK(nickname_input.value)){
      is_button_clicked = false;
      return
    } 
    
    info.innerHTML = "Creating account ..."

   const are_connections_ok =  await handleError()

   if(!are_connections_ok){
    is_button_clicked = false;
    return;
   } 

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
    finally{
      is_button_clicked = false;
    }
  
    
  }
}
