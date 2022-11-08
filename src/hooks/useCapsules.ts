import { useEffect, useState } from "react"

import { fetchCapsules } from "@/repository/capsule"
import { useUser } from "@/auth/useAuth"
import { Capsule } from "@/types/capsule"

export const useCapsules = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([])
  const user = useUser()

  useEffect(() => {
    if (user == null) {
      return
    }
    ;(async () => {
      const capsules = await fetchCapsules(user)
      setCapsules(capsules)
    })()
  }, [user])

  return capsules
}
