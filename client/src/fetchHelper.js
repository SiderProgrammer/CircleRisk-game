const SERVER_URL = "http://localhost:3001"

const post_headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

export default async (data, url) => {
  return fetch(`${SERVER_URL}/${url}`, {
    method: "post",
    headers: post_headers,
    body: JSON.stringify(data),
  })
}
