export const msTosecond = (ms: number) => {
  return ms / 1000
}

export const secondToMs = (second: number) => {
  return second * 1000
}

export const dayToMs = (day: number) => {
  return day * 24 * 60 * 60 * 1000
}

export const dayToSecond = (day: number) => {
  return day * 24 * 60 * 60
}
