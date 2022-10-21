import { arrayUnion, collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore"

import { db } from "@/lib/firebase/init"
import { CupsuleCreateInput } from "@/state/cupsuleCreateInput"
import { AppUser } from "@/types/user"
import { GpsType } from "@/provider/GpsProvider"
import { Capsule } from "@/types/capsule"

/**
 * カプセルの投稿
 */
export const postCapsule = async (
  { matchingId, user }: { matchingId: string; user: AppUser },
  input: CupsuleCreateInput,
  geolocation: GpsType,
) => {
  if (input.openDate == null) {
    console.log({ ...input })
    window.alert("エラーが発生しました")
    return
  }

  await setDoc(
    doc(collection(db, "capsules"), matchingId),
    {
      color: input.color,
      emoji: input.emoji,
      gpsTextColor: input.gpsTextColor,
      title: input.title,
      openDate: Timestamp.fromDate(input.openDate),
      addDate: Timestamp.fromDate(new Date()),
      ownerId: user.id,
      memo: [`${user.id}:${input.memo}`],
      friendIds: [user.id],
      latitude: geolocation.latitude,
      longitude: geolocation.longitude,
    },
    {
      merge: true,
    },
  )
}

/**
 * カプセルの参加
 */
export const joinCapsule = async (
  { matchingId, user }: { matchingId: string; user: AppUser },
  memo: string,
) => {
  console.log(`${user.id}:${memo}`, user.id)
  await setDoc(
    doc(collection(db, "capsules"), matchingId),
    {
      memo: arrayUnion([`${user.id}:${memo}`]),
      friendIds: arrayUnion([user.id]),
    },
    {
      merge: true,
    },
  )
}

/**
 * カプセルの取得
 */

export const fetchCapsule = async ({ capsuleId }: { capsuleId: string }) => {
  const snapshot = await getDoc(doc(collection(db, "capsules"), capsuleId))
  const data = snapshot.data()
  if (data == null) {
    console.log(capsuleId)
    window.alert("カプセル情報の取得に失敗しました" + capsuleId)
    return
  }

  return {
    id: snapshot.id,
    color: data.color,
    emoji: data.emoji,
    gpsTextColor: data.gpsTextColor,
    title: data.title,
    openDate: data.openDate,
    addDate: data.addDate,
    memo: data.memo,
    latitude: data.latitude,
    longitude: data.longitude,
  } as Capsule
}
