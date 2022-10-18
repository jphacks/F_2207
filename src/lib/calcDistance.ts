import { getDistance, getRhumbLineBearing } from "geolib"

import { Location } from "@/types/location"

export const calcDistance = (loc1: Location, loc2: Location) => {
  console.log(loc1.latitude)
  return {
    distance: getDistance(loc1, loc2),
    bearing: getRhumbLineBearing(loc1, loc2),
  }
}
