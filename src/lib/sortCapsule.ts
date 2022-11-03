import { Feature } from "@/types/feature"

export const featureSortFunc = (feature1: Feature, feature2: Feature) => {
  const time1 = new Date(feature1.properties.addDate).getTime()
  const time2 = new Date(feature2.properties.addDate).getTime()
  return time1 > time2 ? 1 : time1 === time2 ? 0 : -1
}
