import {
  START_RECONNECTING_SCENE,
  STOP_RECONNECTING_SCENE,
} from "./fetch-helper"

import { IS_ONLINE } from "./shortcuts/requests"

export default (game) => {
  const checkConnectionTimeInterval = 5000
  let currentScene = {}
  let is_online = true

  setInterval(async () => {
    //   console.log(game.scene.getScenes(true))
    if (await IS_ONLINE()) {
      if (!is_online) {
        STOP_RECONNECTING_SCENE(currentScene)
        is_online = true
      }
    } else {
      if (!is_online) return
      currentScene = game.scene.getScenes(true)[0]
      if (!currentScene) return
      START_RECONNECTING_SCENE(currentScene)
      is_online = false
    }
  }, checkConnectionTimeInterval)
}
