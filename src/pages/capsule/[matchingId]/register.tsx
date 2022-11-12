import {
  Box,
  Button,
  LoadingOverlay,
  Modal,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { AiOutlineEdit, AiOutlineLock, AiOutlineMessage } from "react-icons/ai"
import { NextPage } from "next"
import React, { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { add } from "date-fns"

import WalkthroughLayout from "@/view/layout/walkthrough"
import CapsulePreview from "@/view/CapsulePreview"
import { useUser } from "@/auth/useAuth"
import { CreateFeature } from "@/types/feature"
import {
  clearCapsuleCreateInput,
  capsuleCreateInputState,
  useCapsuleCreateInput,
} from "@/state/capsuleCreateInput"
import { useGeolocation } from "@/provider/GpsProvider"
import { useMatchingWithRedirect } from "@/hooks/useMatching"
import { joinCapsule, postCapsule } from "@/repository/capsule"
import MetaHeader from "@/view/common/MetaHeader"
import { useAuthRouter } from "@/auth/useAuthRouter"
import { goCollectPhase } from "@/repository/matchingCreate"

const Register: NextPage = () => {
  useAuthRouter(true)
  const router = useRouter()
  const theme = useMantineTheme()
  const user = useUser()
  const geolocation = useGeolocation()

  const matchingId = router.query.matchingId as string
  const matching = useMatchingWithRedirect(matchingId)
  const isOwner = matching != null && user != null && matching.ownerId === user.id

  const capsuleCreateInput = useCapsuleCreateInput()

  const [isSaving, setIsSaving] = useState(false)
  const [isSaveSuccessed, setIsSaveSuccessed] = useState(false)

  const isAdminMode = router.query["admin"] == "true"

  const save = async () => {
    if (user == null) {
      window.alert("ログインしてください")
      return
    }

    if (isOwner && (capsuleCreateInput.title == "" || capsuleCreateInput.openDate == null)) {
      window.alert("タイトル、開封日を設定してください")
      return
    }

    try {
      setIsSaving(true)

      if (isOwner) {
        await postCapsule({ matchingId, user }, capsuleCreateInput, geolocation)
      } else {
        await joinCapsule({ matchingId, user }, capsuleCreateInput.memo)
      }

      const feature: CreateFeature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            capsuleCreateInput.geolocation
              ? capsuleCreateInput.geolocation.longitude
              : geolocation.longitude,
            capsuleCreateInput.geolocation
              ? capsuleCreateInput.geolocation.latitude
              : geolocation.latitude,
          ],
        },
        properties: {
          id: matchingId,
          capsuleColor: capsuleCreateInput.color,
          gpsColor: capsuleCreateInput.gpsTextColor,
          emoji: capsuleCreateInput.emoji,
          addDate: new Date().toISOString(),
          openDate: (capsuleCreateInput.openDate ?? add(new Date(), { years: 1 })).toISOString(),
          opened: "false",
        },
      }

      // レイヤーを作る
      // 既にある(=エラー)なら正しいレイヤーを探す
      // 物件を追加
      try {
        const layerId = await postLayer(user.id)
        await postFeature(feature, layerId)
      } catch (e: any) {
        if (e.message === "ALREADY_EXISTS") {
          const layers = await searchLayerID(user.id)
          await Promise.all(layers.map((layer) => postFeature(feature, layer.id)))
        } else {
          throw e
        }
      }
      onSucsessCreateCapsule()
    } finally {
      setIsSaving(false)
    }
  }

  const moveToMap = () => {
    router.push(`/map`)
  }

  const onSucsessCreateCapsule = () => {
    setIsSaveSuccessed(true)
    clearCapsuleCreateInput()
  }

  const postLayer = async (name: string) => {
    try {
      const res = await axios.post<{ id: number }>(
        `https://prod-mqplatform-api.azure-api.net/maps-api/layers/v1/18?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
        {
          name: name,
          type: "circle",
          source_type: "geojson",
          db_type: "document",
          visible: false,
          layout: {
            visibility: "none",
          },
        },
      )
      return res.data.id
    } catch (e) {
      console.error(e)
      throw new Error("ALREADY_EXISTS")
    }
  }

  const searchLayerID = async (name: string) => {
    const res = await axios.get<{ id: number }[]>(
      `https://prod-mqplatform-api.azure-api.net/maps-api/layers/v1/18?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
    )

    return res.data.filter((layer: any) => layer.name == name)
  }

  const postFeature = async (feature: CreateFeature, id: number) => {
    const res = await axios.post(
      `https://prod-mqplatform-api.azure-api.net/maps-api/features/v1/18/${id}?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
      feature,
    )
    return res.data
  }

  return (
    <>
      <MetaHeader title="情報の入力">
        <link rel="prerender" href="/map" />
      </MetaHeader>
      <WalkthroughLayout
        title="カプセルを作ろう"
        totalStep={4}
        currentStep={3}
        onClickNext={save}
        onClickPrevOrClose={isOwner ? () => goCollectPhase(matchingId) : null}
        nextButtonType="bury"
      >
        <Box>
          <LoadingOverlay visible={isSaving} loaderProps={{ size: "xl" }} overlayOpacity={0.6} />
          <CapsulePreview
            capsuleColor={matching?.color ?? capsuleCreateInput.color}
            gpsColor={matching?.gpsTextColor ?? capsuleCreateInput.gpsTextColor}
            emoji={matching?.emoji ?? capsuleCreateInput.emoji}
            lng={matching?.longitude ?? geolocation?.latitude ?? 0}
            lat={matching?.latitude ?? geolocation?.longitude ?? 0}
          />
          <Text className="pb-4" color="white" weight="bold" size="sm">
            カプセルの情報
          </Text>
          {isOwner && (
            <TextInput
              className="pb-3"
              placeholder="タイトルを書く（最大18字）"
              icon={<AiOutlineEdit size={24} color={theme.colors.gray[0]} />}
              value={capsuleCreateInput.title}
              onChange={(e) => {
                capsuleCreateInputState.title = e.target.value
              }}
              variant="filled"
              size="lg"
              iconWidth={48}
              maxLength={18}
              styles={{
                input: {
                  fontSize: 16,
                },
              }}
            />
          )}
          {isOwner && (
            <DatePicker
              className="pb-3"
              placeholder="開封できる日を指定する"
              icon={<AiOutlineLock size={24} color={theme.colors.gray[0]} />}
              value={capsuleCreateInput.openDate}
              onChange={(value) => {
                capsuleCreateInputState.openDate = value
              }}
              minDate={new Date()}
              dropdownType="modal"
              variant="filled"
              firstDayOfWeek="sunday"
              inputFormat="YYYY年M月D日"
              size="lg"
              iconWidth={48}
              styles={{
                input: { fontSize: 16 },
              }}
            />
          )}
          <Textarea
            placeholder="メモを残す"
            icon={<AiOutlineMessage size={24} color={theme.colors.gray[0]} />}
            value={capsuleCreateInput.memo}
            onChange={(e) => {
              capsuleCreateInputState.memo = e.target.value
            }}
            minRows={9}
            variant="filled"
            size="lg"
            iconWidth={48}
            styles={() => ({
              icon: { top: 12, bottom: "initial" },
              input: {
                fontSize: 16,
                lineHeight: 1.75,
              },
            })}
          />
          {isAdminMode && (
            <>
              <TextInput
                label="緯度"
                placeholder="37.1234"
                onChange={(e) => {
                  const longitude =
                    capsuleCreateInputState.geolocation == null
                      ? 0
                      : capsuleCreateInputState.geolocation.longitude
                  capsuleCreateInputState.geolocation = {
                    latitude: parseInt(e.target.value),
                    longitude,
                  }
                }}
              />

              <TextInput
                label="経度"
                placeholder="135.1234"
                onChange={(e) => {
                  const latitude =
                    capsuleCreateInputState.geolocation == null
                      ? 0
                      : capsuleCreateInputState.geolocation.latitude
                  capsuleCreateInputState.geolocation = {
                    latitude,
                    longitude: parseInt(e.target.value),
                  }
                }}
              />
            </>
          )}

          <Modal centered opened={isSaveSuccessed} onClose={moveToMap} withCloseButton={false}>
            <div className="flex flex-col items-center">
              <p>カプセルを埋めました！</p>
              <Button onClick={moveToMap}>地図へ戻る</Button>
            </div>
          </Modal>
        </Box>
      </WalkthroughLayout>
    </>
  )
}

export default Register
