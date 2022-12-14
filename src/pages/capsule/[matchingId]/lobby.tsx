import { NextPage } from "next"
import React, { useEffect } from "react"
import { useRouter } from "next/router"
import { Button, Group, Stack, Text } from "@mantine/core"

import { goCollectPhase } from "@/repository/matchingCreate"
import { useUser } from "@/auth/useAuth"
import { matchingStatus } from "@/repository/matching"
import { useMatchingUsers, useMatchingWithRedirect } from "@/hooks/useMatching"
import WalkthroughLayout from "@/view/layout/walkthrough"
import UserAvater from "@/view/UserAvater"
import Smartphone from "@/view/icons/Smartphone"
import Wave from "@/view/icons/Wave"
import MetaHeader from "@/view/common/MetaHeader"
import { useAuthRouter } from "@/auth/useAuthRouter"

const Lobby: NextPage = () => {
  useAuthRouter(true)

  const router = useRouter()
  const user = useUser()
  const matchingId = router.query.matchingId as string

  const matching = useMatchingWithRedirect(matchingId)
  const matchingUsers = useMatchingUsers(matchingId)

  const isOwner = matching != null && user != null && matching.ownerId === user.id

  const handleConfirmMembers = async () => {
    await goCollectPhase(matchingId)
  }

  useEffect(() => {
    if (matching == null) {
      return
    }
    if (matching.status === matchingStatus.ITEM_COLLECT) {
      router.push(`/capsule/${matchingId}/collect`)
    }
  }, [matching, matchingId, router])

  return (
    <>
      <MetaHeader title="友達の選択">
        <link rel="prerender" href={`/capsule/${matchingId}/collect`} />
      </MetaHeader>
      <WalkthroughLayout
        title="友達とシェアしよう"
        totalStep={4}
        currentStep={1}
        onClickNext={isOwner ? handleConfirmMembers : null}
        onClickPrevOrClose={isOwner ? () => router.push("/capsule/create") : null}
      >
        <Stack align="center">
          <div className="my-[60px] flex max-w-[240px] items-center justify-between space-x-8">
            <div className="flex items-center justify-between space-x-4">
              <Smartphone />
              <Wave />
            </div>
            <div className="flex items-center justify-between space-x-4">
              <Wave className="rotate-180" />
              <Smartphone />
            </div>
          </div>
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
    </>
  )
}

export default Lobby
