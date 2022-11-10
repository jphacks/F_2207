import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import sub from "date-fns/sub"

import { LatLng } from "@/types/location"
import { db } from "@/lib/firebase/db"
import { AppUser } from "@/types/user"

import { isMatchingAlreadyRead, makeMatchingRead } from "./mathcingRead"
import { matchingStatus } from "./matching"

/**
 * マッチングを作成する
 * @returns マッチングID
 */
export const createMatching = async (
  user: AppUser,
  {
    location,
    emoji,
    color,
    gpsTextColor,
  }: { location: LatLng; emoji: string; color: string; gpsTextColor: string },
) => {
  const matchingRef = await addDoc(collection(db, "matching"), {
    id: user.id,
    name: user.name,
    iconUrl: user.iconUrl,
    latitude: location.latitude,
    longitude: location.longitude,
    createdAt: serverTimestamp(),
    status: matchingStatus.MEMBER_JOIN,
    emoji,
    color,
    gpsTextColor,
  })

  await setDoc(doc(collection(doc(collection(db, "matching"), matchingRef.id), "users"), user.id), {
    id: user.id,
    name: user.name,
    iconUrl: user.iconUrl,
    createdAt: serverTimestamp(),
    isOwner: true,
  })

  return matchingRef.id
}

/**
 * マッチングに参加する他のユーザーの購読を開始する
 * @returns 購読を止める
 */
export const startMatching = (matchingId: string, onAddedUser: (user: AppUser) => void) => {
  const matchRef = collection(doc(collection(db, "matching"), matchingId), "users")
  const unsubscribe = onSnapshot(matchRef, (snapshots) => {
    snapshots.docChanges().forEach((docChange) => {
      if (docChange.type === "added") {
        const uid = docChange.doc.id
        const data = docChange.doc.data()
        onAddedUser({
          id: uid,
          name: data.name,
          iconUrl: data.iconUrl,
        })
      }
    })
  })
  return unsubscribe
}

export type Matching = {
  id: string
  host: AppUser
}

/**
 * 進行中のマッチングを取得する
 * @returns 購読を止める
 */
export const listenOngoingMatching = (
  {
    user,
    location,
  }: {
    user: AppUser
    location: LatLng
  },
  onDetectMatching: (matching: Matching) => void,
) => {
  const unsubscribe = onSnapshot(
    query(collection(db, "matching"), where("createdAt", ">=", sub(new Date(), { minutes: 40 }))),
    (snapshots) => {
      snapshots.docChanges().forEach((docChange) => {
        if (docChange.type === "added") {
          const id = docChange.doc.id
          const data = docChange.doc.data()

          // NOTE: 既に募集が締め切られたマッチはスキップする
          if (data.status !== matchingStatus.MEMBER_JOIN) {
            return
          }

          // NOTE: 自分が作成したマッチはスキップする
          if (data.id === user.id) {
            return
          }

          // NOTE: 既に受けた or キャンセルしたマッチはスキップする
          if (isMatchingAlreadyRead({ user, matchingId: id })) {
            return
          }

          const isNearby =
            data.latitude - 0.001 < location.latitude &&
            location.latitude < data.latitude + 0.001 &&
            data.longitude - 0.002 < location.longitude &&
            location.longitude < data.longitude + 0.002

          // NOTE: 近くにないマッチはスキップする
          if (!isNearby) {
            return
          }

          onDetectMatching({
            id,
            host: {
              id: data.id,
              name: data.name,
              iconUrl: data.iconUrl,
            },
          })
        }
      })
    },
  )
  return unsubscribe
}

export const goCollectPhase = async (matchingId: string) => {
  await updateDoc(doc(collection(db, "matching"), matchingId), {
    status: matchingStatus.ITEM_COLLECT,
  })
}

/**
 * マッチングに参加する
 */
export const joinMatching = async ({ user, matchingId }: { user: AppUser; matchingId: string }) => {
  await setDoc(doc(collection(doc(collection(db, "matching"), matchingId), "users"), user.id), {
    id: user.id,
    name: user.name,
    iconUrl: user.iconUrl,
    createdAt: serverTimestamp(),
    isOwner: false,
  })
  makeMatchingRead({ user, matchingId })
}

/**
 * マッチングに参加しない（キャンセルする）
 */
export const cancelMatching = ({ user, matchingId }: { user: AppUser; matchingId: string }) => {
  makeMatchingRead({ user, matchingId })
}
