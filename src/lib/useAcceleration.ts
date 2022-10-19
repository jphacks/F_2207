import { useCallback, useEffect, useMemo, useState } from "react"

import { detectOs } from "./detectOs"

export type Acceleration = {
  x: number
  y: number
  z: number
}

export const useAcceleration = () => {
  const [isReady, setIsReady] = useState(false)
  const [acceleration, setAcceleration] = useState<Acceleration>({ x: 0, y: 0, z: 0 })

  const requirePermission = useCallback(async () => {
    if (detectOs() === "iphone") {
      await (DeviceOrientationEvent as any).requestPermission()
    }
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }
    const handler = (e: DeviceMotionEvent) => {
      const x = e.acceleration?.x ?? 0
      const y = e.acceleration?.y ?? 0
      const z = e.acceleration?.z ?? 0
      setAcceleration({ x, y, z })
    }

    window.addEventListener("devicemotion", handler)
    return () => window.removeEventListener("devicemotion", handler)
  }, [isReady])

  return useMemo(() => ({ requirePermission, acceleration }), [requirePermission, acceleration])
}
