import { CREATE_ACCOUNT } from "./shortcuts/requests"
import { saveProgress } from "./shortcuts/save.js"
import { startGame } from "./index"

export default () => {
  const creator_div = document.querySelector("#first-login")
  const nickname_input = document.querySelector("#nickname-input")
  const accept_button = document.querySelector("#accept-nickname")

  creator_div.style.display = "block"

  accept_button.onclick = () => {
    CREATE_ACCOUNT({ nickname: nickname_input.value }).then((response) => {
      console.log(response)
      if (response.status === 200) {
        saveProgress({ nickname: nickname_input.value })
        creator_div.style.display = "none"
        startGame()
      }
      console.log("account created", response)
    })
  }
}
