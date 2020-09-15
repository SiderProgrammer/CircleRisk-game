const URL = "http://localhost:3001"

const post_headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

export const GET_LEVEL_SCORES_AND_NICKNAMES = async (level) => {
  return fetch(`${URL}/getLevelScoresAndNicknames`, {
    method: "post",
    headers: post_headers,
    body: JSON.stringify({ level: level }),
  }) .then((response) => {
    if (response.status === 200) {
      return response.json()
    }
  })
}

export const POST_LEVEL_SCORE = (config) => {
  fetch(`${URL}/postLevelScore`, {
    method: "post",
    headers: post_headers,
    body: JSON.stringify(config),
  }).then((r) => {
    console.log(r)
  })
}

export const CREATE_ACCOUNT = async (nick) => {
  return fetch(`${URL}/createAccount`, {
    method: "post",
    body: JSON.stringify({ nickname: nick }),
    headers: post_headers,
  })
}

/*

export const GET_USERS_SCORES_AND_NICKNAMES = () => {
  fetch(`${URL}/create`, {
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
  fetch(`${URL}/getUsers`)
    .then((r) => {
      return r.json()
    })
    .then((r) => console.log(r))
    .catch((e) => console.log(e))
}
*/
