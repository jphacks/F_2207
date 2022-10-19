import { NextPage } from "next"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Avatar, Button, Stack } from "@mantine/core"

import { startMatching, stopMatching } from "@/repository/matchingCreate"
import { AppUser } from "@/types/user"
import { useUser } from "@/auth/useAuth"
import { matchingStatus } from "@/repository/matching"
import DefaultLayout from "@/view/layout/default"
import { useMatchingWithRedirect } from "@/hooks/useMatching"

/**
 * マッチングの参加者情報を購読する
 */
const useMatchingUsers = (matchingId: string) => {
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

const Lobby: NextPage = () => {
  const router = useRouter()
  const user = useUser()
  const matchingId = router.query.matchingId as string

  const matching = useMatchingWithRedirect(matchingId)
  const matchingUsers = useMatchingUsers(matchingId)

  const handleConfirmMembers = async () => {
    await stopMatching(matchingId)
  }

  useEffect(() => {
    if (matching == null) {
      return
    }
    if (matching.status === matchingStatus.ITEM_COLLECT) {
      router.push(`/cupsel/${matchingId}/collect`)
    }
  }, [matching, matchingId, router])

  return (
    <DefaultLayout>
      <Stack>
        {matchingUsers.map((user) => (
          <div key={user.id} className="flex items-center">
            <Avatar src={user.iconUrl} />
            <p>{user.name}</p>
          </div>
        ))}
        {matching != null && user != null && matching.ownerId === user.id && (
          <Button onClick={handleConfirmMembers}>参加者を確定する</Button>
        )}
      </Stack>
    </DefaultLayout>
  )
}

export default Lobby
