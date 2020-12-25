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
let interval;
const checkConnection = async () => {
  console.log("check")
  if (await IS_ONLINE()) {
    if (!(await IS_SERVER_ALIVE())) {
     
      START_SERVER_MAINTENANCE_SCENE(scene.game.scene.getScenes(true))
    }

    if (!is_online) {
      clearInterval(interval);

      STOP_RECONNECTING_SCENE(paused_scenes)
      is_online = true
 
    }
  } else {
    if (!is_online) return

  interval = setInterval(checkConnection,checkConnectionTimeInterval)
    paused_scenes = scene.game.scene.getScenes(true)
    
    START_RECONNECTING_SCENE(paused_scenes)
    is_online = false
  }
}
    checkConnection()

}
