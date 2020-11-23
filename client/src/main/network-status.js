import {
  START_RECONNECTING_SCENE,
  STOP_RECONNECTING_SCENE,
  START_SERVER_MAINTENANCE_SCENE,
} from "./fetch-helper"
import { IS_ONLINE, IS_SERVER_ALIVE } from "./shortcuts/requests"

export default (game) => {
  const checkConnectionTimeInterval = 5000

  let is_online = true
  let paused_scenes = []

  const is_online_interval = setInterval(async () => {
    // console.log(game.scene.getScenes(true))

    if (await IS_ONLINE()) {
      if (!(await IS_SERVER_ALIVE())) {
        clearInterval(is_online_interval)
        START_SERVER_MAINTENANCE_SCENE(game.scene.getScenes(true))
      }

      if (!is_online) {
        STOP_RECONNECTING_SCENE(paused_scenes)

        is_online = true
      }
    } else {
      if (!is_online) return

      paused_scenes = game.scene.getScenes(true)

      if (paused_scenes.length === 0) return

      START_RECONNECTING_SCENE(paused_scenes)

      is_online = false
    }
  }, checkConnectionTimeInterval)
}
