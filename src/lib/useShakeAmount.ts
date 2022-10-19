import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useAcceleration } from "./useAcceleration"

/**
 * 端末を振った量を計算する
 */
export const useShakeAmount = () => {
  const { acceleration, requirePermission } = useAcceleration()

  const [shakeAmount, setShakeAmount] = useState(0)

  const deltas = useRef<number[]>([])

  console.log(acceleration.x, acceleration.y, acceleration.z)
  deltas.current.push((acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2) / 5)

  useEffect(() => {
    const timer = setInterval(() => {
      if (10 < deltas.current.length) {
        console.log(deltas.current)

        setShakeAmount(
          (prev) => prev + deltas.current.reduce((acc, c) => acc + c, 0) / deltas.current.length,
        )
        deltas.current = []
      }
    }, 300)

    return () => clearInterval(timer)
  }, [])

  const resetAmount = useCallback(() => {
    setShakeAmount(0)
  }, [])

  return useMemo(
    () => ({ resetAmount, shakeAmount, acceleration, requirePermission }),
    [resetAmount, shakeAmount, acceleration, requirePermission],
  )
}
