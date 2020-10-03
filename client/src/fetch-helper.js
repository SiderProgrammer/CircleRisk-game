const SERVER_URL = "http://192.168.1.12:3001"

const post_headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

export const postFunction = (data, url) => {
  return fetch(`${SERVER_URL}/${url}`, {
    method: "post",
    headers: post_headers,
    body: JSON.stringify(data),
  })
}

export const getFunction = (url) => {
  return fetch(`${SERVER_URL}/${url}`, {
    headers: post_headers,
  })
}

export const START_RECONNECTING_SCENE = function (scene, x, y) {
  scene.scene.pause()
  scene.scene.launch("offline", {
    x: scene.game.GW / 2,
    y: scene.game.GH / 2,
  })
  scene.scene.bringToTop("offline")
}

export const STOP_RECONNECTING_SCENE = function (scene) {
  scene.scene.resume()
  scene.scene.stop("offline")
}

export const START_FETCHING_SCENE = function (scene, x, y) {
  scene.scene.pause()
  scene.scene.launch("fetching", {
    x: scene.game.GW / 2,
    y: scene.game.GH / 2,
  })
  scene.scene.bringToTop("fetching")
}

export const STOP_FETCHING_SCENE = function (scene) {
  scene.scene.resume()
  scene.scene.stop("fetching")
}

export const CREATE_FETCH_ERROR = (scene, x, y) => {
  scene.add
    .text(x, y, "Oops... Something went wrong, try again later", {
      font: `60px ${main_font}`,
      fontwordWrap: {
        width: scene.game.GW * 0.8,
      },
    })
    .setOrigin(0.5)
}
export const CREATE_RECONNECTING_TEXT = (scene, x, y) => {
  scene.add
    .text(x, y, "Reconnecting ...", { font: `60px ${main_font}` })
    .setOrigin(0.5)
}
