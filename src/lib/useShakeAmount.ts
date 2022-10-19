import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useAcceleration } from "./useAcceleration"

/**
 * 端末を振った量を計算する
 */
export const useShakeAmount = () => {
  const { acceleration, requirePermission } = useAcceleration()

  const [shakeAmount, setShakeAmount] = useState(0)

  const deltas = useRef<number[]>([])

  deltas.current.push((acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2) / 5)

  useEffect(() => {
    const timer = setInterval(() => {
      if (deltas.current.length < 10) {
        return
      }
      const deltaSum = deltas.current.reduce((acc, c) => acc + c, 0) / deltas.current.length

      if (Number.isNaN(deltaSum)) {
        return
      }

      setShakeAmount((prev) => prev + deltaSum)
      deltas.current = []
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
