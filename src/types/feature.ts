export type FeatureData = {
  geometry: {
    coordinates: number[]
  }
  properties: {
    id: string
    capsuleColor: string
    gpsColor: string
    emoji: string
    openDate: string
  }
}

export type CreateFeature = {
  type: string
  geometry: {
    type: string
  }
  properties: {
    addDate: string
  }
} & FeatureData

export type Feature = {
  id: string
  properties: {
    _revision: number
  }
} & CreateFeature
