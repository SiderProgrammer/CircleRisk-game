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

export const START_SERVER_MAINTENANCE_SCENE = function(scenes){
  scenes.forEach(({ scene }) => scene.pause())

  scenes[0].scene.launch("serverMaintenance")
  scenes[0].scene.bringToTop("serverMaintenance")
}

export const START_RECONNECTING_SCENE = function (scenes) {
  scenes.forEach(({ scene }) => scene.pause())

  scenes[0].scene.launch("offline", {
    x: scenes[0].game.GW / 2,
    y: scenes[0].game.GH / 2,
  })
  scenes[0].scene.bringToTop("offline")
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

  paused_fetching_scenes.forEach(({ scene }) => scene.pause())

  paused_fetching_scenes[0].scene.launch("fetching", {
    x: paused_fetching_scenes[0].game.GW / 2,
    y: paused_fetching_scenes[0].game.GH / 2,
  })
  paused_fetching_scenes[0].scene.bringToTop("fetching")
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

