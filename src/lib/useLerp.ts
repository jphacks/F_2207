import { useEffect, useRef, useState } from "react"

const ALPHA = 0.2

const round = (value: number) => Math.round(value * 10) / 10

export const useLerp = (value: number) => {
  const prevValue = useRef(0.0)
  const [smoothedValue, setSmoothedValue] = useState(0.0)

  useEffect(() => {
    const updateSmoothedValue = () => {
      const newValue = prevValue.current * (1 - ALPHA) + value * ALPHA
      prevValue.current = newValue
      setSmoothedValue(round(newValue))
    }

    const timer = setInterval(updateSmoothedValue, 300)
    return () => clearInterval(timer)
  }, [value])

  return smoothedValue
}
