import { proxy, useSnapshot } from "valtio"

export type CapsuleCreateInput = {
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

const initValue: CapsuleCreateInput = {
  color: capsuleColors[0],
  emoji: "🥩",
  gpsTextColor: gpsColors[0],
  title: "",
  openDate: null,
  addDate: null,
  memo: "",
  geolocation: null,
}

export const capsuleCreateInputState = proxy<CapsuleCreateInput>(initValue)

export const useCapsuleCreateInput = () => useSnapshot(capsuleCreateInputState, { sync: true })
export const clearCapsuleCreateInput = () => {
  capsuleCreateInputState.color = initValue.color
  capsuleCreateInputState.emoji = initValue.emoji
  capsuleCreateInputState.gpsTextColor = initValue.gpsTextColor
  capsuleCreateInputState.title = initValue.title
  capsuleCreateInputState.openDate = initValue.openDate
  capsuleCreateInputState.addDate = initValue.addDate
  capsuleCreateInputState.memo = initValue.memo
  capsuleCreateInputState.geolocation = initValue.geolocation
}
