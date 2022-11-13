import { Button, Modal, Drawer } from "@mantine/core"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import axios from "axios"

import { useShakeAmount } from "@/lib/useShakeAmount"
import { Capsule } from "@/types/capsule"
import { formatDate } from "@/lib/date"
import { Feature } from "@/types/feature"
import { setCapsuleOpen } from "@/repository/capsule"

import CapsulComponent from "./Capsule"
import ShakeCapsuleModel from "./ShakeCapsuleModel"

export type DiscoverDrawerPorps = {
  open: boolean
  onClose: () => void
  href: string
  capsule: Capsule
  layerID: string
  featureID: string
}

const TOTAL_COUNT = 100

const DiscoverDrawer: React.FC<DiscoverDrawerPorps> = ({
  open,
  onClose,
  capsule,
  layerID,
  featureID,
}) => {
  const router = useRouter()
  const [shakeMode, setShakeMode] = useState(false)
  const [cleared, setCleared] = useState(false)
  const { requirePermission, shakeAmount, resetAmount } = useShakeAmount(shakeMode)

  const updateCapsuleStatusOpened = useCallback(async () => {
    // get old data
    const feature: Feature = await axios
      .get(
        `https://prod-mqplatform-api.azure-api.net/maps-api/features/v1/18/${layerID}?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
      )
      .then((res) => {
        const features = res.data.features.filter((feature: Feature) => {
          return feature.properties.id == capsule.id
        })
        return features.length == 0 ? null : features[0]
      })

    if (feature == null) {
      return
    }

    // mapquest update
    const newFeature = {
      id: feature.id,
      geometry: feature.geometry,
      properties: {
        addDate: feature.properties.addDate,
        id: feature.properties.id,
        capsuleColor: feature.properties.capsuleColor,
        gpsColor: feature.properties.gpsColor,
        emoji: feature.properties.emoji,
        openDate: feature.properties.openDate,
        opened: "true",
        _revision: feature.properties._revision,
      },
    }
    axios.put(
      `https://prod-mqplatform-api.azure-api.net/maps-api/features/v1/18/${layerID}/${feature.id}?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
      newFeature,
    )

    // firebase update
    setCapsuleOpen({ capsuleId: feature.properties.id })
  }, [capsule.id, featureID, layerID])

  useEffect(() => {
    if (TOTAL_COUNT < shakeAmount) {
      setCleared(true)
      updateCapsuleStatusOpened()
    }
  }, [resetAmount, shakeAmount, updateCapsuleStatusOpened])

  const shakeRate = Math.min(100, (shakeAmount / TOTAL_COUNT) * 100)

  const shakeRateRef = useRef<number>(shakeRate)
  useEffect(() => {
    shakeRateRef.current = shakeRate / 100
  }, [shakeRate])

  return (
    <>
      <Drawer
        opened={open}
        onClose={onClose}
        padding="xl"
        size={shakeMode ? 500 : 300}
        withCloseButton={false}
        position="bottom"
        overlayOpacity={0}
        styles={{
          drawer: {
            borderRadius: "12px 12px 0 0",
          },
        }}
      >
        <div className="my-8 flex items-center space-x-8">
          <div className="shrink-0">
            <CapsulComponent
              capsuleColor={capsule.color}
              gpsColor={capsule.gpsTextColor}
              emoji={capsule.emoji}
              size="xs"
              lng={capsule.longitude}
              lat={capsule.latitude}
              bgSx={{
                boxShadow: "0px 2.7200000286102295px 33.31999969482422px 0px #FFFFFF40",
              }}
              onClick={() => {}}
            />
          </div>
          <div>
            <p className="m-0 text-lg font-bold text-white">{capsule.title}</p>
            <p className="m-0">東京都丘高校付近・{formatDate(capsule.addDate)}に作成</p>
          </div>
        </div>
        {shakeMode ? (
          <div className="flex w-full flex-col items-center">
            <div className="relative flex h-[64px] w-full items-center justify-center overflow-hidden rounded-lg bg-[#424242] font-bold text-white">
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${shakeRate}%`,
                  background: `linear-gradient(82.28deg, #D3F36B 10.99%, #54C874 100.05%)`,
                }}
              />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
                スマホを振ってカプセルを開けよう
              </div>
            </div>
            {shakeRate < 10 ? (
              <div className="w-[120px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/shake.png"
                  alt=""
                  width={120}
                  className="relative z-10 mt-8 w-[120px] self-start"
                />
              </div>
            ) : (
              <div className="h-[240px] w-full">
                <Canvas>
                  <ShakeCapsuleModel openRateRef={shakeRateRef} />
                </Canvas>
              </div>
            )}
          </div>
        ) : (
          <Button
            onClick={async () => {
              await requirePermission()
              setShakeMode(true)
            }}
            color="brand.3"
            fullWidth
            size="md"
            variant="outline"
            mt={48}
          >
            カプセルを見つけた
          </Button>
        )}
      </Drawer>
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
          <p className="text-xl font-bold text-white transition">クリア！</p>
          {/* <video src="/capsule_animation.mp4" className="w-full" muted autoPlay playsInline /> */}
          <Button
            onClick={() => router.push(`/capsule/open/${capsule.id}/show`)}
            className="mt-4 transition"
          >
            思い出を見る
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default DiscoverDrawer
