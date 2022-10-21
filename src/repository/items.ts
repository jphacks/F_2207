import { onSnapshot, collection, doc, writeBatch, serverTimestamp } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes, UploadResult } from "firebase/storage"

import { db, storage } from "@/lib/firebase/init"
import { generateId } from "@/lib/generateId"
import { AppUser } from "@/types/user"

/**
 * マッチングの中で投稿された画像の枚数
 * @returns 購読を止める
 */
export const listenItemCount = (
  matchingId: string,
  onItemAdded: (itemUpdates: Record<string, number>) => void,
) => {
  const matchRef = collection(doc(collection(db, "matching"), matchingId), "items")
  const unsubscribe = onSnapshot(matchRef, (snapshots) => {
    snapshots.docChanges().forEach((docChange) => {
      const itemUpdates: Record<string, number> = {}
      if (docChange.type === "added") {
        const data = docChange.doc.data()
        const createdBy = data.createdBy
        itemUpdates[createdBy] = (itemUpdates[createdBy] ?? 0) + 1
      }
      console.log(itemUpdates)
      onItemAdded(itemUpdates)
    })
  })
  return unsubscribe
}

export const postItem = async (
  { user, matchingId }: { user: AppUser; matchingId: string },
  files: File[],
) => {
  const fileObjects = files.map((file) => ({ id: generateId(), file }))
  const results = await Promise.allSettled(
    fileObjects.map(({ file, id }) =>
      uploadBytes(ref(storage, `cupsules/${matchingId}/${id}`), file),
    ),
  )

  const downloadUrls = await Promise.allSettled(
    results
      .filter(
        (result): result is PromiseFulfilledResult<UploadResult> => result.status === "fulfilled",
      )
      .map((result) => getDownloadURL(result.value.ref)),
  )

  const matchRef = collection(doc(collection(db, "matching"), matchingId), "items")

  const batch = writeBatch(db)
  downloadUrls.forEach((downloadUrl, i) => {
    if (downloadUrl.status === "fulfilled") {
      batch.set(doc(matchRef, fileObjects[i].id), {
        itemurl: downloadUrl.value,
        createdBy: user.id,
        createdAt: serverTimestamp(),
      })
    }
  })
  await batch.commit()
  console.log("batch end")
}
