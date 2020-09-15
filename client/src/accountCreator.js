import { CREATE_ACCOUNT } from "./shortcuts/requests"
import { saveProgress } from "./shortcuts/save.js"

export default () => {
  document.querySelector("#first-login").style.display = "block"

  const nickname_input = document.querySelector("#nickname-input")
  const accept_button = document.querySelector("#accept-nickname")

  accept_button.onclick = () => {
    CREATE_ACCOUNT(nickname_input.value).then((response) => {
      console.log(response)
      if (response.status === 200) {
        saveProgress({ nickname: nickname_input.value })
        startGame()
      }
      console.log("account created", response)
    })
  }
}
