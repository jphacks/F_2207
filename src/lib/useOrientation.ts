import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { detectOs } from "../lib/detectOs"

export type Orientation = { x: number; y: number }

export const useOrientation = () => {
  const orientationRef = useRef<Orientation>({ x: 0, y: 0 })
  const [orientation, setOrientation] = useState<Orientation>({ x: 0, y: 0 })
  const [isReady, setIsReady] = useState(false)

  const requestPermission = useCallback(async () => {
    if (detectOs() === "iphone") {
      await (DeviceOrientationEvent as any).requestPermission()
    }
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }
    const listener = (e: DeviceOrientationEvent) => {
      const alpha = e.alpha
      const beta = e.beta
      const gamma = e.gamma
      if (alpha == null || beta == null || gamma == null) {
        return
      }

      const degrees: number =
        detectOs() == "iphone"
          ? (e as any).webkitCompassHeading
          : compassHeading(alpha, beta, gamma)

      setOrientation({ x: degrees, y: beta })
      orientationRef.current = { x: degrees, y: beta }
    }
    window.addEventListener("deviceorientation", listener)
    return () => window.removeEventListener("deviceorientation", listener)
  }, [isReady])

  return useMemo(
    () => ({ orientationRef, orientation, requestPermission }),
    [requestPermission, orientation],
  )
}

const compassHeading = (alpha: number, beta: number, gamma: number) => {
  const _x = (beta * Math.PI) / 180
  const _y = (gamma * Math.PI) / 180
  const _z = (alpha * Math.PI) / 180

  const cY = Math.cos(_y)
  const cZ = Math.cos(_z)
  const sX = Math.sin(_x)
  const sY = Math.sin(_y)
  const sZ = Math.sin(_z)

  const Vx = -cZ * sY - sZ * sX * cY
  const Vy = -sZ * sY + cZ * sX * cY

  let compassHeading = Math.atan(Vx / Vy)

  if (Vy < 0) {
    compassHeading += Math.PI
  } else if (Vx < 0) {
    compassHeading += 2 * Math.PI
  }

  return compassHeading * (180 / Math.PI)
}
