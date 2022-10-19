import { getDistance, getRhumbLineBearing } from "geolib"

import { LatLng } from "@/types/location"

export const calcDistance = (loc1: LatLng, loc2: LatLng) => {
  console.log(loc1.latitude)
  return {
    distance: getDistance(loc1, loc2),
    bearing: getRhumbLineBearing(loc1, loc2),
  }
}
