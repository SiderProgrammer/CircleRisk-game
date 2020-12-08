import { getFunction, postFunction } from "../fetch-helper"

export const GET_LEVEL_SCORES_AND_NICKNAMES = async (data) => {
  const response = await postFunction(data, "getLevelScoresAndNicknames")
  if (response.ok) return response.json()
}

export const GET_LEVEL_SCORE_BY_NICKNAME = async (data) => {
  const response = await postFunction(data, "getLevelScoreByNickname")
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

export const CREATE_ACCOUNT = (data) => {
  return postFunction(data, "createAccount")
}

export const SAVE_NEW_SKIN = (data) => {
  return postFunction(data, "saveNewSkin")
}

export const POST_LEVEL_SCORE = async (data) => {
  await postFunction(data, "postLevelScore")
}

export const SAVE_MONEY = (data) => {
  postFunction(data, "saveMoney")
}

export const EQUIP_SKIN = (data) => {
  postFunction(data, "equipSkin")
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
    const response = await fetch("http://192.168.1.12:3001/isServerAlive")

    if (response.status === 200) return true
  } catch {
    return false
  }
}
