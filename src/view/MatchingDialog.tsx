import React, { useEffect, useState } from "react"
import { Button, Drawer, Text, Center } from "@mantine/core"
import Image from "next/image"
import { useRouter } from "next/router"

import { useUser } from "@/auth/useAuth"
import { useGeolocation } from "@/provider/GpsProvider"
import {
  listenOngoingMatching,
  joinMatching,
  Matching,
  cancelMatching,
} from "@/repository/matchingCreate"

export type MatchingDialogProps = {
  children: React.ReactNode
}

const MatchingDialog: React.FC<MatchingDialogProps> = ({ children }) => {
  const router = useRouter()
  const user = useUser()
  const location = useGeolocation()
  const [matchingQueue, setMatchingQueue] = useState<Matching[]>([])

  useEffect(() => {
    if (user == null || location == null || location.latitude == 0 || location.longitude == 0) {
      return
    }
    const unsubscribe = listenOngoingMatching({ user, location }, (matching) => {
      setMatchingQueue((matchings) => [...matchings, matching])
    })
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location == null, location.latitude == 0, location.longitude == 0, user])

  const matching = matchingQueue[0]

  const handleJoin = async () => {
    if (user == null || matching == null) {
      return
    }
    await joinMatching({ user, matchingId: matching.id })
    router.push(`/capsule/${matching.id}/lobby`)
  }

  const showDialog = router.asPath.split("?")[0] === "/map"

  return (
    <>
      {children}
      <Drawer
        opened={showDialog && matching != null}
        onClose={() => {
          setMatchingQueue((matchings) => {
            if (matchings.length === 0) {
              return []
            }
            const [_, ...restMatchings] = matchings
            return restMatchings
          })
          if (user != null) {
            cancelMatching({ user, matchingId: matching.id })
          }
        }}
        title={<Text color="white">招待が届きました</Text>}
        padding="xl"
        size={300}
        position="bottom"
        styles={{
          drawer: {
            borderRadius: "12px 12px 0 0",
          },
        }}
      >
        <div className="my-8 flex items-center">
          <div className="h-20 w-20 shrink-0">
            <Image
              src={matching?.host?.iconUrl ?? ""}
              alt=""
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <Center style={{ width: "100%" }} px={16}>
            <Text color="white" weight="bold">
              {matching?.host?.name}さんのカプセル
            </Text>
          </Center>
        </div>
        <Button color="brand.3" onClick={handleJoin} fullWidth size="md" data-autofocus>
          <Text color="black">参加する</Text>
        </Button>
      </Drawer>
    </>
  )
}

export default MatchingDialog
