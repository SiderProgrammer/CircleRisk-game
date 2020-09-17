const SERVER_URL = "http://localhost:3001"

const post_headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

const postFunction = async (data, url) => {
  return fetch(`${SERVER_URL}/${url}`, {
    method: "post",
    headers: post_headers,
    body: JSON.stringify(data),
  })
}

const isOK = (response) => {
  if (response.status === 200) return true
  return false
}

export const GET_LEVEL_SCORES_AND_NICKNAMES = async (data) => {
  return await postFunction(data, "getLevelScoresAndNicknames").then(
    (response) => {
      if (isOK(response)) {
        return response.json()
      }
    }
  )
}

export const POST_LEVEL_SCORES = async (data) => {
  return await postFunction(data, "postLevelScore").then((response) => {
    console.log(response)
  })
}

export const CREATE_ACCOUNT = async (data) => {
  return await postFunction(data, "createAccount")
}

export const GET_ACCOUNT_PROGRESS = async (data) => {
  return await postFunction(data, "getAccountProgress").then((response) => {
    if (isOK(response)) {
      return response.json()
    }
  })
}

/*
export const POST_LEVEL_SCORE = (config) => {
  fetch(`${SERVER_URL}/postLevelScore`, {
    method: "post",
    headers: post_headers,
    body: JSON.stringify(config),
  }).then((r) => {
    console.log(r)
  })
}

export const CREATE_ACCOUNT = async (data) => {
  return fetch(`${SERVER_URL}/createAccount`, {
    method: "post",
    body: JSON.stringify(data),
    headers: post_headers,
  })
}

export const GET_ACCOUNT_PROGRESS = async (nick) => {
  return fetch(`${SERVER_URL}/getAccountProgress`, {
    method: "post",
    body: JSON.stringify({ nickname: nick }),
    headers: post_headers,
  }).then((response) => {
    if (response.status === 200) {
      return response.json()
    }
  })
}
*/

/*

export const GET_USERS_SCORES_AND_NICKNAMES = () => {
  fetch(`${SERVER_URL}/create`, {
    method: "post",
    body: JSON.stringify({ name: "fetchedf", username: "tfetch" }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((r) => {
      return r.json()
    })
    .then((r) => console.log(r))
    .catch((e) => console.log(e))
}

export const POST_SCORE = () => {
  fetch(`${SERVER_URL}/getUsers`)
    .then((r) => {
      return r.json()
    })
    .then((r) => console.log(r))
    .catch((e) => console.log(e))
}
*/
