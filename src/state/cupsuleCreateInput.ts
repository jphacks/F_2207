import { proxy, useSnapshot } from "valtio"

export type CupsuleCreateInput = {
  color: typeof capsuleColors[number] | string
  emoji: string
  gpsTextColor: typeof gpsColors[number] | string
  title: string
  openDate: Date | null
  addDate: Date | null
  memo: string
  geolocation: {
    latitude: number
    longitude: number
  } | null
}

export const capsuleColors = [
  "#D3F36B" as const,
  "#9581F2" as const,
  "#F1ABDD" as const,
  "#EB5040" as const,
  "#DE6437" as const,
  "#F8D551" as const,
  "#6BE58B" as const,
  "#73E4E3" as const,
  "#2351D5" as const,
  "#000000" as const,
  "#D3DAE1" as const,
  "#FFFFFF" as const,
]

export const gpsColors = ["#000000" as const, "#FFFFFF" as const]

const initValue: CupsuleCreateInput = {
  color: capsuleColors[0],
  emoji: "🥩",
  gpsTextColor: gpsColors[0],
  title: "",
  openDate: null,
  addDate: null,
  memo: "",
  geolocation: null,
}

export const cupsuleCreateInputState = proxy<CupsuleCreateInput>(initValue)

export const useCupsuleCreateInput = () => useSnapshot(cupsuleCreateInputState, { sync: true })
export const clearCupsuleCreateInput = () => {
  cupsuleCreateInputState.color = initValue.color
  cupsuleCreateInputState.emoji = initValue.emoji
  cupsuleCreateInputState.gpsTextColor = initValue.gpsTextColor
  cupsuleCreateInputState.title = initValue.title
  cupsuleCreateInputState.openDate = initValue.openDate
  cupsuleCreateInputState.addDate = initValue.addDate
  cupsuleCreateInputState.memo = initValue.memo
  cupsuleCreateInputState.geolocation = initValue.geolocation
}
