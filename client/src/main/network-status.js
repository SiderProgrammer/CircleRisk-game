import {
  START_RECONNECTING_SCENE,
  STOP_RECONNECTING_SCENE,
  START_SERVER_MAINTENANCE_SCENE,
} from "./fetch-helper"
import { IS_ONLINE, IS_SERVER_ALIVE } from "./shortcuts/requests"

export default async(scene) => {
  const checkConnectionTimeInterval = 5000

  let is_online = true
  let paused_scenes = []

const checkConnection = async () => {
  if (await IS_ONLINE()) {
    if (!(await IS_SERVER_ALIVE())) {
     
      START_SERVER_MAINTENANCE_SCENE(scene.game.scene.getScenes(true))
    }

    if (!is_online) {
      clearInterval(checkConnection);

      STOP_RECONNECTING_SCENE(paused_scenes)
      is_online = true
 
    }
  } else {
    if (!is_online) return

    setInterval(checkConnection,checkConnectionTimeInterval)
    paused_scenes = scene.game.scene.getScenes(true)
    
    START_RECONNECTING_SCENE(paused_scenes)
    is_online = false
  }
}
    checkConnection()

}
