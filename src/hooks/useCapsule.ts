import { useEffect, useState } from "react"

import { fetchCapsule } from "@/repository/capsule"
import { Capsule } from "@/types/capsule"

export const useCapsule = (capsuleId: string) => {
  const [capsule, setCapsule] = useState<Capsule | null>(null)

  useEffect(() => {
    ;(async () => {
      const capsule = await fetchCapsule({ capsuleId })
      if (capsule != null) {
        setCapsule(capsule)
      }
    })()
  }, [capsuleId])
  return capsule
}
