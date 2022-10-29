import { Box, Drawer, Text } from "@mantine/core"
import { useCallback, useState } from "react"
import { Props as PickerProps } from "emoji-picker-react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import useSWR from "swr"

import CapsulePreview from "@/view/CapsulePreview"
import ColorSelector from "@/view/CapsuleColorSelector"
import WalkthroughLayout from "@/view/layout/walkthrough"
import { createMatching } from "@/repository/matchingCreate"
import { useUser } from "@/auth/useAuth"
import { useGeolocation } from "@/provider/GpsProvider"
import {
  capsuleColors,
  cupsuleCreateInputState,
  gpsColors,
  useCupsuleCreateInput,
} from "@/state/cupsuleCreateInput"

import type { NextPage } from "next"
import type { EmojiClickData } from "emoji-picker-react"

const Picker = dynamic<PickerProps>(() => import("emoji-picker-react"))

const CapsuleAdd: NextPage = () => {
  const router = useRouter()
  const location = useGeolocation()
  const user = useUser()

  const cupsuleCreateInput = useCupsuleCreateInput()

  const [opened, setOpened] = useState(false)

  const onEmojiClick = (emoji: EmojiClickData) => {
    cupsuleCreateInputState.emoji = emoji.emoji
    setOpened(false)
  }

  const handleClickNext = useCallback(async () => {
    if (user == null) {
      window.alert("ログインしてください")
      return
    }
    if (location == null) {
      window.alert("位置情報の利用を許可してください")
      return
    }
    const matchingId = await createMatching({ user, location })
    await router.push(`/cupsel/${matchingId}/lobby`)
  }, [location, router, user])

  const { data: Theme } = useSWR("emoji-picker-react.Theme", () =>
    import("emoji-picker-react").then(({ Theme }) => Theme),
  )

  return (
    <>
      <WalkthroughLayout
        title="カプセルを作ろう"
        totalStep={4}
        currentStep={0}
        onClickNext={handleClickNext}
        onClickPrevOrClose={() => router.push("/")}
      >
        <CapsulePreview
          capsuleColor={cupsuleCreateInput.color}
          gpsColor={cupsuleCreateInput.gpsTextColor}
          emoji={cupsuleCreateInput.emoji}
          lng={location?.longitude ?? 0}
          lat={location?.latitude ?? 0}
        />
        <Box className="p-4">
          <Text color="white" weight="bold" size="sm">
            カプセルの色
          </Text>
          <ColorSelector
            colors={capsuleColors}
            onSelect={(color) => {
              cupsuleCreateInputState.color = color
            }}
          />
        </Box>
        <Box className="p-4">
          <Text color="white" weight="bold" size="sm">
            絵文字
          </Text>
          <Box
            component="button"
            mt={12}
            p={12}
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              fontWeight: "normal",
              textAlign: "start",
              width: "100%",
              background: theme.colors.gray[8],
              border: "none",
              borderRadius: 4,
              color: "white",
              lineHeight: 1,

              "&:focus": {
                outline: "none",
              },
            })}
            onClick={() => setOpened(true)}
          >
            <span className="mr-3 text-xl leading-none">🙂</span>
            <span className="leading-none">カプセル絵文字を変更する</span>
          </Box>
        </Box>
        <Box className="p-4">
          <Text color="white" weight="bold" size="sm">
            GPSロゴの色
          </Text>
          <ColorSelector
            colors={gpsColors}
            onSelect={(gpsColor) => {
              cupsuleCreateInputState.gpsTextColor = gpsColor
            }}
          />
        </Box>
      </WalkthroughLayout>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size={400}
        position="bottom"
        padding={0}
        withCloseButton={false}
      >
        <Picker
          theme={Theme?.DARK}
          skinTonesDisabled
          width="100%"
          height="100%"
          searchDisabled
          onEmojiClick={onEmojiClick}
          previewConfig={{
            showPreview: false,
          }}
        />
      </Drawer>
    </>
  )
}

export default CapsuleAdd
