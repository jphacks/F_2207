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

// const x = {
//   place_id: 136763066,
//   licence: "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
//   osm_type: "way",
//   osm_id: 134526097,
//   lat: "34.87016093067636",
//   lon: "135.60888875323542",
//   display_name: "芝谷町, 高槻市, 大阪府, 569-1022, 日本",
//   address: {
//     quarter: "芝谷町",
//     city: "高槻市",
//     province: "大阪府",
//     "ISO3166-2-lvl4": "JP-27",
//     postcode: "569-1022",
//     country: "日本",
//     country_code: "jp",
//   },
//   boundingbox: ["34.8700382", "34.8705589", "135.6085463", "135.6099992"],
// }

// const y = {
//   place_id: 128731274,
//   licence: "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
//   osm_type: "way",
//   osm_id: 105430529,
//   lat: "35.6923922",
//   lon: "139.7581189473426",
//   display_name:
//     "学術総合センター, 神田警察通り, 一ツ橋二丁目, 一ツ橋, 千代田区, 東京都, 101-8430, 日本",
//   address: {
//     building: "学術総合センター",
//     road: "神田警察通り",
//     neighbourhood: "一ツ橋二丁目",
//     city: "千代田区",
//     postcode: "101-8430",
//     country: "日本",
//     country_code: "jp",
//   },
//   boundingbox: ["35.6921008", "35.6927985", "139.7574483", "139.7586387"],
// }
