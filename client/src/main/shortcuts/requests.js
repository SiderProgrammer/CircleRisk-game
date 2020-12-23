import { getFunction, postFunction,fetchWithTimeout } from "../fetch-helper"
import {SERVER_URL} from "../fetch-helper"

export const GET_GAME_VERSION = async () => {
  const response = await getFunction("getGameVersion")
  if (response.ok) return response.json()
}

export const GET_ACCOUNT_SCORES = async (data) => {
  const response = await postFunction(data, "getAccountScores")
  if (response.ok) return response.json()
}

export const GET_ACCOUNT_PROGRESS = async (data) => {
  const response = await postFunction(data, "getAccountProgress")
  if (response.ok) return response.json()
}

export const GET_CONFIGURATIONS = async () => {
  const response = await getFunction("getConfigurations")
  if (response.ok) return response.json()
}

export const GET_TOP_SCORES = async (data) => {
  const response = await postFunction(data,"getTopScores")
  if (response.ok) return response.json()
}
export const GET_RANK_FROM_SCORE = async (data) => {
  const response = await postFunction(data,"getRankFromScore")
  if (response.ok) return response.json()
}

export const CREATE_ACCOUNT = (data) => {
  return postFunction(data, "createAccount")
}

export const SAVE_NEW_SKIN =  (data) => {
  return postFunction(data, "saveNewSkin")
}

export const POST_LEVEL_SCORE = (data) => {
  return  postFunction(data, "postLevelScore")
}

export const SAVE_MONEY =  (data) => {
 return  postFunction(data, "saveMoney")
}

export const EQUIP_SKIN =  (data) => {
 return  postFunction(data, "equipSkin")
}


export const IS_ONLINE = async () => {
  try {
    // it works only if the server is alive
    const response = await fetch("https://www.google.com", { mode: "no-cors" })

    if (response) return true
  } catch {
    return false
  }
}

export const IS_SERVER_ALIVE = async () => {
  try {
  
    const response = await fetchWithTimeout(`${SERVER_URL}/isServerAlive`,{
      timeout: 5000
    })
    if (response.status === 200) return true
  } catch {
    return false
  }
}

