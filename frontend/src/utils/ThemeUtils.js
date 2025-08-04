export const applyThemeBasedOnTime = () => {
  const hour = new Date().getHours()
  const isNightTime = hour >= 18 || hour < 6

  const root = document.documentElement

  if (isNightTime) {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}


export const isDarkMode = () => {
  const hour = new Date().getHours()
  return hour >= 18 || hour < 6
}
