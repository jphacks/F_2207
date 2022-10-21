import { NextPage } from "next"
import React, { useEffect, useState } from "react"
import { Button, Modal, Text } from "@mantine/core"
import { useRouter } from "next/router"

import { useShakeAmount } from "@/lib/useShakeAmount"

const TOTAL_COUNT = 800

const Shake: NextPage = () => {
  const router = useRouter()
  const capsuleId = router.query.capsuleId as string
  const [start, setStart] = useState(false)
  const [cleared, setCleared] = useState(false)
  const { acceleration, requirePermission, shakeAmount, resetAmount } = useShakeAmount()

  useEffect(() => {
    if (TOTAL_COUNT < shakeAmount) {
      setCleared(true)
    }
  }, [resetAmount, shakeAmount])

  return (
    <>
      <Modal centered opened={cleared} onClose={() => {}} withCloseButton={false}>
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold text-white">クリア！</p>
          <p>動画</p>
          <Button onClick={() => router.push(`/cupsel/open/${capsuleId}/show`)}>
            思い出を見る
          </Button>
        </div>
      </Modal>
      <div className="fixed inset-0 flex flex-col items-center justify-center">
        <div
          className="-z-1 absolute inset-x-0 bottom-0 bg-[#5ef4bd]"
          style={{ height: `${Math.min(100, (shakeAmount / TOTAL_COUNT) * 100)}%` }}
        />
        <Text color="white" size="xl" weight="bold" className="relative z-10">
          みんなでふってカプセルを開けよう！
        </Text>
        <img
          src="/shake.png"
          className="relative z-10 mt-8 self-start"
          style={{ maxWidth: "100%", width: 300 }}
        />
        {!start && (
          <div className="w-full px-6">
            <Button
              color="brand.3"
              onClick={async () => {
                await requirePermission()
                setStart(true)
              }}
              fullWidth
              size="md"
              mt={24}
            >
              <Text color="black">スタート</Text>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default Shake
