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
  clearCupsuleCreateInput,
  cupsuleCreateInputState,
  useCupsuleCreateInput,
} from "@/state/cupsuleCreateInput"
import { useGeolocation } from "@/provider/GpsProvider"
import { useMatchingWithRedirect } from "@/hooks/useMatching"
import { joinCapsule, postCapsule } from "@/repository/capsule"

const Register: NextPage = () => {
  const router = useRouter()
  const theme = useMantineTheme()
  const user = useUser()
  const geolocation = useGeolocation()

  const matchingId = router.query.matchingId as string
  const matching = useMatchingWithRedirect(matchingId)
  const isOwner = matching != null && user != null && matching.ownerId === user.id

  const cupsuleCreateInput = useCupsuleCreateInput()

  const [isSaving, setIsSaving] = useState(false)
  const [isSaveSuccessed, setIsSaveSuccessed] = useState(false)

  const save = async () => {
    setIsSaving(true)
    if (user == null) {
      window.alert("ログインしてください")
      onFailCreateCapsule()
      return
    }

    if (isOwner) {
      if (cupsuleCreateInput.title == "" || cupsuleCreateInput.openDate == null) {
        window.alert("タイトル、開封日を設定してください")
        onFailCreateCapsule()
        return
      }

      await postCapsule({ matchingId, user }, cupsuleCreateInput, geolocation)
    } else {
      await joinCapsule({ matchingId, user }, cupsuleCreateInput.memo)
    }

    // TODO: オーナーの処理に移す
    const feature: CreateFeature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [geolocation.longitude, geolocation.latitude],
      },
      properties: {
        id: matchingId,
        capsuleColor: cupsuleCreateInput.color,
        gpsColor: cupsuleCreateInput.gpsTextColor,
        emoji: cupsuleCreateInput.emoji,
        addDate: new Date().toISOString(),
        openDate: (cupsuleCreateInput.openDate ?? add(new Date(), { years: 1 })).toISOString(),
      },
    }

    // レイヤーを作る
    // 既にある(=エラー)なら正しいレイヤーを探す
    // 物件を追加
    postLayer(
      user.id,
      (res) => {
        postFeature(feature, res.data.id, onSucsessCreateCapsule, onFailCreateCapsule)
      },
      () => {
        searchLayerID(user.id, (id) => {
          postFeature(feature, id, onSucsessCreateCapsule, onFailCreateCapsule)
        })
      },
    )
  }

  const moveToMap = () => {
    router.push(`/map`)
  }

  const onSucsessCreateCapsule = () => {
    setIsSaveSuccessed(true)
    setIsSaving(false)
    clearCupsuleCreateInput()
  }
  const onFailCreateCapsule = () => {
    setIsSaving(false)
  }

  const postLayer = (
    name: string,
    callback: (res: any) => void,
    errorCallback: (err: any) => void,
  ) => {
    axios
      .post(
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
      .then((res) => {
        callback(res)
      })
      .catch((err) => {
        errorCallback(err)
      })
  }

  const searchLayerID = (name: string, callback: (res: any) => void) => {
    axios
      .get(
        `https://prod-mqplatform-api.azure-api.net/maps-api/layers/v1/18?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
      )
      .then((res) => {
        // @ts-ignore
        res.data.forEach((layer) => {
          if (layer.name == name) {
            callback(layer.id)
          }
        })
      })
  }

  const postFeature = (
    feature: CreateFeature,
    id: number,
    callback: (res: any) => void,
    errorCallback: (error: any) => void,
  ) => {
    axios
      .post(
        `https://prod-mqplatform-api.azure-api.net/maps-api/features/v1/18/${id}?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
        feature,
      )
      .then((res) => {
        callback(res)
      })
      .catch((err) => {
        errorCallback(err)
      })
  }

  return (
    <WalkthroughLayout
      title="カプセルを作ろう"
      totalStep={4}
      currentStep={3}
      onClickNext={save}
      onClickPrevOrClose={isOwner ? () => router.push(`/cupsel/${matchingId}/collect`) : null}
      nextButtonType="bury"
    >
      <Box>
        <LoadingOverlay visible={isSaving} loaderProps={{ size: "xl" }} overlayOpacity={0.6} />
        <CapsulePreview
          capsuleColor={cupsuleCreateInput.color}
          gpsColor={cupsuleCreateInput.gpsTextColor}
          emoji={cupsuleCreateInput.emoji}
          lng={geolocation.longitude ?? 0}
          lat={geolocation.latitude ?? 0}
        />
        <Text className="pb-4" color="white" weight="bold" size="sm">
          カプセルの情報
        </Text>
        {isOwner && (
          <TextInput
            className="pb-3"
            placeholder="タイトルを書く（最大18字）"
            icon={<AiOutlineEdit size={24} color={theme.colors.gray[0]} />}
            value={cupsuleCreateInput.title}
            onChange={(e) => {
              cupsuleCreateInputState.title = e.target.value
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
            value={cupsuleCreateInput.openDate}
            onChange={(value) => {
              cupsuleCreateInputState.openDate = value
            }}
            minDate={new Date()}
            dropdownType="modal"
            variant="filled"
            firstDayOfWeek="sunday"
            inputFormat="YYYY年M月D日"
            size="lg"
            iconWidth={48}
            styles={(theme) => ({
              input: { fontSize: 16, "&::placeholder": { color: theme.colors.gray[0] } },
            })}
          />
        )}
        <Textarea
          placeholder="メモを残す"
          icon={<AiOutlineMessage size={24} color={theme.colors.gray[0]} />}
          value={cupsuleCreateInput.memo}
          onChange={(e) => {
            cupsuleCreateInputState.memo = e.target.value
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
        <Modal centered opened={isSaveSuccessed} onClose={moveToMap} withCloseButton={false}>
          <div className="flex flex-col items-center">
            <p>カプセルを埋めました！</p>
            <Button onClick={moveToMap}>地図へ戻る</Button>
          </div>
        </Modal>
      </Box>
    </WalkthroughLayout>
  )
}

export default Register
