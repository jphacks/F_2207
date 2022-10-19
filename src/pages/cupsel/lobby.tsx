import { Button } from "@mantine/core"
import React, { useCallback } from "react"
import { useRouter } from "next/router"
import { NextPage } from "next"

import { useUser } from "@/auth/useAuth"
import { useGeolocation } from "@/lib/useGeolocation"
import { createMatching } from "@/repository/matchingCreate"
import DefaultLayout from "@/view/layout/default"

const Lobby: NextPage = () => {
  const router = useRouter()
  const user = useUser()
  const location = useGeolocation()

  const handleCreateMatching = useCallback(async () => {
    if (user == null || location?.coords == null) {
      return
    }
    const matchingId = await createMatching({ user, location: location?.coords })
    await router.push(`/cupsel/${matchingId}/lobby`)
  }, [location?.coords, router, user])

  return (
    <DefaultLayout>
      <div className="p-4">
        <Button onClick={handleCreateMatching}>Fetch nearby friends</Button>
      </div>
    </DefaultLayout>
  )
}

export default Lobby
