import {
  onSnapshot,
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  updateDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes, UploadResult } from "firebase/storage"

import { db } from "@/lib/firebase/db"
import { storage } from "@/lib/firebase/storage"
import { AppUser } from "@/types/user"
import { Item } from "@/types/item"

import { matchingStatus } from "./matching"

/**
 * マッチングの中で投稿された画像の枚数
 * @returns 購読を止める
 */
export const listenItems = (matchingId: string, onItemAdded: (itemUpdates: Item[]) => void) => {
  const matchRef = query(
    collection(doc(collection(db, "matching"), matchingId), "items"),
    orderBy("createdAt", "desc"),
  )
  const unsubscribe = onSnapshot(matchRef, (snapshots) => {
    const addedItems = snapshots
      .docChanges()
      .map((docChange) => {
        if (docChange.type === "added") {
          const data = docChange.doc.data()
          return {
            id: docChange.doc.id,
            createdBy: data.createdBy,
            createdAt: data.createdAt?.toDate(),
            itemUrl: data.itemurl,
            mimeType: data.mimeType,
          }
        }
      })
      .filter((item): item is Item => item != null)
    onItemAdded(addedItems)
  })
  return unsubscribe
}

/**
 * 画像や動画を投稿する
 */
export const postItem = async (
  { user, matchingId }: { user: AppUser; matchingId: string },
  files: { id: string; file: File }[],
) => {
  const results = await Promise.allSettled(
    files.map(({ file, id }) => uploadBytes(ref(storage, `cupsules/${matchingId}/${id}`), file)),
  )

  const downloadUrls = await Promise.allSettled(
    results
      .filter(
        (result): result is PromiseFulfilledResult<UploadResult> => result.status === "fulfilled",
      )
      .map((result, i) =>
        getDownloadURL(result.value.ref).then((url) => ({
          mimeType: files[i].file.type,
          url,
        })),
      ),
  )

  const matchRef = collection(doc(collection(db, "matching"), matchingId), "items")

  const batch = writeBatch(db)
  downloadUrls.forEach((downloadUrl, i) => {
    if (downloadUrl.status === "fulfilled") {
      batch.set(doc(matchRef, files[i].id), {
        mimeType: downloadUrl.value.mimeType,
        itemurl: downloadUrl.value.url,
        createdBy: user.id,
        createdAt: serverTimestamp(),
      })
    }
  })
  await batch.commit()
}

export const moveToRegister = async (matchingId: string) => {
  const matchRef = doc(collection(db, "matching"), matchingId)
  await updateDoc(matchRef, {
    status: matchingStatus.INFO_REGISTER,
  })
}

export const fetchItems = async (capsuleId: string) => {
  const matchRef = collection(doc(collection(db, "matching"), capsuleId), "items")
  console.log("matchRef")

  const snapshots = await getDocs(matchRef)

  console.log(snapshots)

  return snapshots.docs.map((snapshot) => ({
    id: snapshot.id,
    itemurl: snapshot.data().itemurl,
  }))
}
