const URL = "http://localhost:3001"

export const GET_USERS = () => {
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

export const CREATE_ACCOUNT = async (nick) => {
  return fetch(`${URL}/createAccount`, {
    method: "post",
    body: JSON.stringify({ nickname: nick }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).catch((e) => console.log(e))
}
