export const saveProgress = (item) => {
  localStorage.setItem("progress", JSON.stringify(item))
}

export const getProgress = () => {
  return JSON.parse(localStorage.getItem("progress"))
}
