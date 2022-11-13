import axios from "axios"

export const getAddress = async (lat: number, lng: number) => {
  const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
    params: {
      format: "json",
      lat,
      lon: lng,
    },
  })
  const frags = res.data.display_name.split(", ")
  frags.reverse()
  return frags.slice(2).join("")
}
