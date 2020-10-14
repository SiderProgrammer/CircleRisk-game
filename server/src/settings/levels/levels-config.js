const easy_levels_config = require("./easy")
const medium_levels_config = require("./medium")
const hard_levels_config = require("./hard")

function mergeLevelsConfigurations() {
  easy_levels_config.forEach((level) => (level.info.difficulty = "easy"))
  medium_levels_config.forEach((level) => (level.info.difficulty = "medium"))
  hard_levels_config.forEach((level) => (level.info.difficulty = "hard"))

  const merged = [...easy_levels_config]

  function mergeEasyWithMedium() {
    for (let i in easy_levels_config) {
      merged[merged.length] = medium_levels_config.find(
        (level) => level.info.name === merged[i].info.name
      )
    }
  }

  function mergeEasyMediumWithHard() {
    for (let i in easy_levels_config) {
      merged[merged.length] = hard_levels_config.find(
        (level) => level.info.name === merged[i].info.name
      )
    }
  }

  mergeEasyWithMedium()
  mergeEasyMediumWithHard()

  return merged
}

module.exports = mergeLevelsConfigurations()
