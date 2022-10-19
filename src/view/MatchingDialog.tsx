import React, { useEffect, useState } from "react"
import { Button, Drawer } from "@mantine/core"
import Image from "next/image"
import { useRouter } from "next/router"

import { useUser } from "@/auth/useAuth"
import { useGeolocation } from "@/lib/useGeolocation"
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
    if (user == null || location == null) {
      return
    }
    const unsubscribe = listenOngoingMatching({ user, location: location.coords }, (matching) => {
      setMatchingQueue((matchings) => [...matchings, matching])
    })
    return unsubscribe
  }, [location, user])

  const matching = matchingQueue[0]

  const handleJoin = async () => {
    if (user == null || matching == null) {
      return
    }
    await joinMatching({ user, matchingId: matching.id })
    router.push(`/cupsel/${matching.id}/lobby`)
  }

  const isTimecupselOngoing = router.asPath.startsWith(`/cupsel/`)

  return (
    <>
      {children}
      <Drawer
        opened={matching != null && !isTimecupselOngoing}
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
        title="タイムカプセルに参加する"
        padding="xl"
        size="md"
        position="bottom"
      >
        <div className="flex items-center space-x-4">
          {matching != null && (
            <Image
              src={matching?.host?.iconUrl ?? ""}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
          )}
          <p>{matching?.host?.name}さんのタイムカプセル</p>
        </div>
        <Button onClick={handleJoin}>参加する</Button>
      </Drawer>
    </>
  )
}

export default MatchingDialog
