import { NextPage } from "next"
import React, { useEffect } from "react"
import { Button } from "@mantine/core"

import DefaultLayout from "@/view/layout/default"
import { useShakeAmount } from "@/lib/useShakeAmount"

const TOTAL_COUNT = 1000

const Shake: NextPage = () => {
  const { acceleration, requirePermission, shakeAmount, resetAmount } = useShakeAmount()

  useEffect(() => {
    if (TOTAL_COUNT < shakeAmount) {
      window.alert("クリア！")
      resetAmount()
    }
  }, [resetAmount, shakeAmount])

  return (
    <DefaultLayout>
      <div className="relative p-4">
        <p>
          ({acceleration.x.toFixed(2)}, {acceleration.y.toFixed(2)}, {acceleration.z.toFixed(2)})
        </p>
        <p>{shakeAmount}</p>
        <Button onClick={requirePermission}>OK</Button>
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 bg-black"
          style={{
            height: `${Math.min(100, (shakeAmount / TOTAL_COUNT) * 100)}%`,
          }}
        />
      </div>
    </DefaultLayout>
  )
}

export default Shake
