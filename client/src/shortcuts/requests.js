import { getFunction, postFunction } from "../fetch-helper"

export const GET_LEVEL_SCORES_AND_NICKNAMES = async (data) => {
  return await postFunction(data, "getLevelScoresAndNicknames").then(
    (response) => {
      if (response.ok) {
        return response.json()
      }
    }
  )
}

export const GET_LEVEL_SCORE_BY_NICKNAME = async (data) => {
  return await postFunction(data, "getLevelScoreByNickname").then(
    (response) => {
      if (response.ok) {
        return response.json()
      }
    }
  )
}

export const POST_LEVEL_SCORE = async (data) => {
  return await postFunction(data, "postLevelScore").then((response) => {
    console.log(response)
  })
}

export const CREATE_ACCOUNT = async (data) => {
  return await postFunction(data, "createAccount")
}

export const GET_ACCOUNT_PROGRESS = async (data) => {
  return await postFunction(data, "getAccountProgress").then((response) => {
    if (response.ok) {
      return response.json()
    }
  })
}

export const SAVE_NEW_SKIN = async (data) => {
  return await postFunction(data, "saveNewSkin")
}

export const SAVE_MONEY = async (data) => {
  await postFunction(data, "saveMoney")
}

export const EQUIP_SKIN = async (data) => {
  await postFunction(data, "equipSkin")
}

export const GET_CUSTOMIZE_SKINS_SETUP = async () => {
  return await getFunction("getCustomizeSkinsSetup").then((response) => {
    if (response.ok) {
      return response.json()
    }
  })
}
