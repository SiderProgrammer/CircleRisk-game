const SERVER_URL = "http://localhost:3001"

const post_headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

export const postFunction = async (data, url) => {
  return fetch(`${SERVER_URL}/${url}`, {
    method: "post",
    headers: post_headers,
    body: JSON.stringify(data),
  })
}

export const getFunction = async (url) => {
  return fetch(`${SERVER_URL}/${url}`, {
    headers: post_headers,
  })
}
