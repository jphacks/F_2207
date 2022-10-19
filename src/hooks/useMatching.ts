import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import { listenMatching, Matching, matchingStatus } from "@/repository/matching"

/**
 * マッチング情報を取得する
 */
export const useMatching = (matchingId: string) => {
  const [matching, setMatching] = useState<Matching | null>(null)

  useEffect(() => {
    const unsubscribe = listenMatching(matchingId, (matching) => {
      setMatching(matching)
    })
    return unsubscribe
  }, [matchingId])

  return matching
}

/**
 * マッチング情報を取得し、ステータスが変化したらURLを遷移させる
 */
export const useMatchingWithRedirect = (matchingId: string) => {
  const router = useRouter()
  const matching = useMatching(matchingId)

  useEffect(() => {
    if (matching == null) {
      return
    }
    if (matching.status === matchingStatus.ITEM_COLLECT) {
      router.push(`/cupsel/${matchingId}/collect`)
      return
    }

    if (matching.status === matchingStatus.INFO_REGISTER) {
      router.push(`/cupsel/${matchingId}/register`)
      return
    }
  }, [matching, matchingId, router])

  return matching
}
