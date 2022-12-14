import { onSnapshot, collection, doc } from "firebase/firestore"

import { db } from "@/lib/firebase/db"

export type Matching = {
  id: string
  status: MatchingStatus
  ownerId: string
  emoji: string
  color: string
  gpsTextColor: string
  longitude: number
  latitude: number
}

export const matchingStatus = {
  MEMBER_JOIN: "MEMBER_JOIN" as const,
  ITEM_COLLECT: "ITEM_COLLECT" as const,
  INFO_REGISTER: "INFO_REGISTER" as const,
}

export type MatchingStatus = typeof matchingStatus[keyof typeof matchingStatus]

export const listenMatching = (
  matchingId: string,
  onMatchingChange: (matching: Matching) => void,
) => {
  onSnapshot(doc(collection(db, "matching"), matchingId), async (snapshot) => {
    const id = snapshot.id
    const data = snapshot.data()
    if (data == null) {
      return
    }

    onMatchingChange({
      id,
      status: data.status,
      ownerId: data.id,
      emoji: data.emoji,
      color: data.color,
      gpsTextColor: data.gpsTextColor,
      longitude: data.longitude,
      latitude: data.latitude,
    })
  })
}
