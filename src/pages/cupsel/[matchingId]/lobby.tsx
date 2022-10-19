import { NextPage } from "next"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Button, Group, Stack, Text } from "@mantine/core"

import { startMatching, stopMatching } from "@/repository/matchingCreate"
import { AppUser } from "@/types/user"
import { useUser } from "@/auth/useAuth"
import { matchingStatus } from "@/repository/matching"
import { useMatchingWithRedirect } from "@/hooks/useMatching"
import WalkthroughLayout from "@/view/layout/walkthrough"
import UserAvater from "@/view/UserAvater"

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

  const isOwner = matching != null && user != null && matching.ownerId === user.id

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
    <WalkthroughLayout
      title="友達とシェアしよう"
      totalStep={4}
      currentStep={1}
      onClickNext={isOwner ? handleConfirmMembers : null}
      onClickPrevOrClose={isOwner ? () => router.push("/cupsel/create") : null}
    >
      <Stack align="center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/communication.png" width="80%" className="my-[60px] max-w-[240px]" alt="" />
        {isOwner && (
          <Button color="brand.3" onClick={() => {}} fullWidth size="md">
            <Text color="black">近くにいる友だちを招待</Text>
          </Button>
        )}
        <Stack mt={32} align="self-start" style={{ width: "100%" }} spacing={16}>
          <Text color="white" weight="bold" size="sm">
            参加者
          </Text>
          <Text size={32} weight="bold" color="white">
            {matchingUsers.length}名
          </Text>
          <Group spacing={10}>
            {matchingUsers.map((matchingUser) => (
              <UserAvater key={matchingUser.id} user={matchingUser} />
            ))}
          </Group>
        </Stack>
      </Stack>
    </WalkthroughLayout>
  )
}

export default Lobby
