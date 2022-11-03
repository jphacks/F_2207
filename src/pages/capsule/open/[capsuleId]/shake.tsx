import { NextPage } from "next"
import React, { useEffect, useState } from "react"
import { Button, Modal, Text } from "@mantine/core"
import { useRouter } from "next/router"
import classNames from "classnames"

import { useShakeAmount } from "@/lib/useShakeAmount"
import MetaHeader from "@/view/common/MetaHeader"

const TOTAL_COUNT = 100

const Shake: NextPage = () => {
  const router = useRouter()
  const capsuleId = router.query.capsuleId as string
  const [start, setStart] = useState(false)
  const [cleared, setCleared] = useState(false)
  const { requirePermission, shakeAmount, resetAmount } = useShakeAmount()
  const [movieEnd, setMovieEnd] = useState(false)

  useEffect(() => {
    if (TOTAL_COUNT < shakeAmount) {
      setCleared(true)
      setTimeout(() => setMovieEnd(true), 2500)
    }
  }, [resetAmount, shakeAmount])

  return (
    <>
      <MetaHeader title="カプセルを開ける">
        <link rel="preload" href="/capsule_animation.mp4" as="video" />
      </MetaHeader>
      <Modal
        centered
        fullScreen
        opened={cleared}
        onClose={() => {}}
        withCloseButton={false}
        styles={{
          modal: {
            padding: "0px !important",
          },
          body: {
            height: "100%",
          },
        }}
      >
        <div className="flex h-full flex-col items-center justify-center">
          <p
            className={classNames(
              "text-xl font-bold text-white transition",
              !movieEnd && "opacity-0",
            )}
          >
            クリア！
          </p>
          <video src="/capsule_animation.mp4" className="w-full" muted autoPlay playsInline />
          <Button
            onClick={() => router.push(`/capsule/open/${capsuleId}/show`)}
            className={classNames("mt-4 transition", !movieEnd && "opacity-0")}
          >
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/shake.png"
          alt=""
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
