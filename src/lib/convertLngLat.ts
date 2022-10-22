type LngLat = "lng" | "lat"

export const convertLngLat = (num: number, type: LngLat) => {
  const degree = Math.floor(num)
  const minute = Math.floor((num - degree) * 60)
  const second = ((num - degree - minute / 60) * 3600).toFixed(1)
  var symbol = ""
  if (type == "lng" && num < 0) {
    symbol = "S"
  } else if (type == "lng" && num >= 0) {
    symbol = "N"
  } else if (type == "lat" && num < 0) {
    symbol = "W"
  } else if (type == "lat" && num >= 0) {
    symbol = "E"
  }

  return `${degree}°${minute}'${second}\"${symbol}`
}
