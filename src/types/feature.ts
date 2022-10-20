export type Feature = {
  type: string
  id: string
  geometry: {
    type: string
    coordinates: [number]
  }
  properties: {
    capsuleColor: string
    gpsColor: string
    emoji: string
    addDate: string
    openDate: string
    _revision: number
  }
}
