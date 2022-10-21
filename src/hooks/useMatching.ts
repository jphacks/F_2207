import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import { listenMatching, Matching, matchingStatus } from "@/repository/matching"
import { useUser } from "@/auth/useAuth"
import { AppUser } from "@/types/user"
import { startMatching } from "@/repository/matchingCreate"

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matching, matchingId])

  return matching
}

/**
 * マッチングの参加者情報を購読する
 */
export const useMatchingUsers = (matchingId: string) => {
  const user = useUser()
  const [matchingUsers, setMatchingUsers] = useState<AppUser[]>([])

  useEffect(() => {
    const unsubscribe = startMatching(matchingId, (matchingUser) => {
      setMatchingUsers((prev) => [...prev, matchingUser])
    })
    return unsubscribe
  }, [matchingId, user?.id])

  return matchingUsers
}
