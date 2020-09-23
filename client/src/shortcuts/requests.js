import * as fetcher from "../fetch-helper"

export const GET_LEVEL_SCORES_AND_NICKNAMES = async (data) => {
  return await fetcher
    .postFunction(data, "getLevelScoresAndNicknames")
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
    })
}

export const POST_LEVEL_SCORE = async (data) => {
  return await fetcher.postFunction(data, "postLevelScore").then((response) => {
    console.log(response)
  })
}

export const CREATE_ACCOUNT = async (data) => {
  return await fetcher.postFunction(data, "createAccount")
}

export const GET_ACCOUNT_PROGRESS = async (data) => {
  return await fetcher
    .postFunction(data, "getAccountProgress")
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
    })
}

export const SAVE_NEW_SKIN = async (data) => {
  return await fetcher.postFunction(data, "saveNewSkin")
}

export const SAVE_MONEY = async (data) => {
  await fetcher.postFunction(data, "saveMoney")
}

export const EQUIP_SKIN = async (data) => {
  await fetcher.postFunction(data, "equipSkin")
}

export const GET_CUSTOMIZE_SKINS_SETUP = async () => {
  return await fetcher
    .getFunction("getCustomizeSkinsSetup")
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
    })
}
