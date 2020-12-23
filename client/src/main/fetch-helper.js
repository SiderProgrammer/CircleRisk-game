export const SERVER_URL = "http://192.168.1.12:3001"

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

export const postFunction = (data, url) => {
  return fetch(`${SERVER_URL}/${url}`, {
    method: "post",
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const getFunction = (url) => {
  return fetch(`${SERVER_URL}/${url}`, {
    headers: headers,
  })
}
export async function fetchWithTimeout(resource, options) {
  const { timeout} = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}

const launchUniqueScene = function(sceneKey,scenes){
  scenes.forEach(({ scene }) => scene.pause())

  scenes[0].scene.launch(sceneKey)
  scenes[0].scene.bringToTop(sceneKey)
}


export const START_SERVER_MAINTENANCE_SCENE = function(scenes){
  launchUniqueScene("serverMaintenance",scenes)
}

export const START_UPDATE_GAME_SCENE = function(scene){
  scene.scene.start("updateGame")
}

export const START_RECONNECTING_SCENE = function (scenes) {
  launchUniqueScene("offline",scenes)
}

export const STOP_RECONNECTING_SCENE = function (scenes) {
  scenes[0].scene.stop("offline")
  scenes.forEach(({ scene }) => scene.resume())
}

let paused_fetching_scenes = []

export const START_FETCHING_SCENE = function (scene) {
  paused_fetching_scenes = scene.game.scene.getScenes(true)

  paused_fetching_scenes.push(scene) /// if scene start didnt complete, it is counted as not active so i have to add it manually
  scene.scene.pause() /// and pause manually

  launchUniqueScene("fetching",paused_fetching_scenes)
}

export const STOP_FETCHING_SCENE = function (scene) {
  paused_fetching_scenes.forEach(({ scene }) => scene.resume())
  paused_fetching_scenes[0].scene.stop("fetching")
}

export const CREATE_FETCH_ERROR = (scene, x, y) => {
  scene.add
    .text(
      x,
      y,
      "Oops... Something went wrong. Check your internet connection or try again later...",
      {
        font: `60px ${main_font}`,
        fontwordWrap: {
          width: scene.game.GW * 0.8,
        },
      }
    )
    .setOrigin(0.5)
}
export const CREATE_RECONNECTING_TEXT = (scene, x, y) => {
  scene.add

    .text(x, y, "Reconnecting ...", { font: `60px ${main_font}` })
    .setOrigin(0.5)
}

