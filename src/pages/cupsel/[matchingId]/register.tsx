import { Text, Textarea, TextInput, useMantineTheme } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { AiOutlineEdit, AiOutlineLock, AiOutlineMessage } from "react-icons/ai"
import { NextPage } from "next"
import React, { useContext, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"

import WalkthroughLayout from "@/view/layout/walkthrough"
import CapsulePreview from "@/view/CapsulePreview"
import { CapsuleContext } from "@/pages/_app"
import { useUser } from "@/auth/useAuth"
import { CreateFeature } from "@/types/feature"

const Register: NextPage = () => {
  const router = useRouter()
  const theme = useMantineTheme()
  const user = useUser()
  const { capsule, setCapsule } = useContext(CapsuleContext)

  const [title, setTitle] = useState("")
  const [date, setDate] = useState<Date | null>(null)
  const [memo, setMemo] = useState("")

  const matchingId = router.query.matchingId as string

  const save = async () => {
    if (user == null || title == "" || date == null) {
      return
    }

    const feature: CreateFeature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: capsule.geometry.coordinates,
      },
      properties: {
        capsuleColor: capsule.properties.capsuleColor,
        gpsColor: capsule.properties.gpsColor,
        emoji: capsule.properties.emoji,
        addDate: new Date().toDateString(),
        openDate: date.toDateString(),
      },
    }

    // レイヤーを作る
    // 既にある(=エラー)なら正しいレイヤーを探す
    // 物件を追加
    postLayer(
      user.id,
      (res) => {
        postFeature(feature, res.data.id, onSucsessCreateCapsule)
      },
      () => {
        searchLayerID(user.id, (id) => {
          postFeature(feature, id, onSucsessCreateCapsule)
        })
      },
    )
  }

  const onSucsessCreateCapsule = () => {
    // TODO: いい感じの何かをだす
    router.push(`/map`)
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

  const postFeature = (feature: CreateFeature, id: number, callback: (res: any) => void) => {
    axios
      .post(
        `https://prod-mqplatform-api.azure-api.net/maps-api/features/v1/18/${id}?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
        feature,
      )
      .then((res) => {
        callback(res)
      })
  }

  return (
    <WalkthroughLayout
      title="カプセルを作ろう"
      totalStep={4}
      currentStep={3}
      onClickNext={save}
      onClickPrevOrClose={() => router.push(`/cupsel/${matchingId}/collect`)}
    >
      <CapsulePreview
        capsuleColor={capsule.properties.capsuleColor}
        gpsColor={capsule.properties.gpsColor}
        emoji={capsule.properties.emoji}
        lng={capsule.geometry.coordinates[0]}
        lat={capsule.geometry.coordinates[1]}
      />
      <Text className="pb-4" color="white" weight="bold" size="sm">
        カプセルの情報
      </Text>
      <TextInput
        className="pb-3"
        placeholder="タイトルを書く（最大18字）"
        icon={<AiOutlineEdit size={24} color={theme.colors.gray[0]} />}
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        variant="filled"
        size="lg"
        iconWidth={48}
        // @ts-ignore
        maxlength="18"
      />
      <DatePicker
        className="pb-3"
        placeholder="開封できる日を指定する"
        icon={<AiOutlineLock size={24} color={theme.colors.gray[0]} />}
        value={date}
        onChange={(value) => setDate(value)}
        minDate={new Date()}
        dropdownType="modal"
        variant="filled"
        size="lg"
        iconWidth={48}
        styles={(theme) => ({ input: { "&::placeholder": { color: theme.colors.gray[0] } } })}
      />
      <Textarea
        placeholder="メモを残す"
        icon={<AiOutlineMessage size={24} color={theme.colors.gray[0]} />}
        value={memo}
        onChange={(e) => setMemo(e.currentTarget.value)}
        minRows={9}
        variant="filled"
        size="lg"
        iconWidth={48}
        styles={() => ({ icon: { top: 12, bottom: "initial" } })}
      />
    </WalkthroughLayout>
  )
}

export default Register
