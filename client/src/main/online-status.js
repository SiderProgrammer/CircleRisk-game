import {
  START_RECONNECTING_SCENE,
  STOP_RECONNECTING_SCENE,
} from "./fetch-helper"

import { IS_ONLINE } from "./shortcuts/requests"

export default (game) => {
  let currentScene = {}
  let is_online = true

  setInterval(async () => {
    if (await IS_ONLINE()) {
      if (!is_online) {
        STOP_RECONNECTING_SCENE(currentScene)
        is_online = true
      }
    } else {
      if (!is_online) return
      currentScene = game.scene.getScenes(true)[0]

      START_RECONNECTING_SCENE(currentScene)
      is_online = false
    }
  }, 5000)
}
