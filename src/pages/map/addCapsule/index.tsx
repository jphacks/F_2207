import { Box, Drawer, Text, useMantineTheme } from "@mantine/core"
import { useState } from "react"
import Picker, { Theme } from "emoji-picker-react"

import CapsulePreview from "@/view/CapsulePreview"
import ColorSelector from "@/view/CapsuleColorSelector"
import WalkthroughLayout from "@/view/layout/walkthrough"

import type { NextPage } from "next"
import type { EmojiClickData } from "emoji-picker-react"

const CapsuleAdd: NextPage = () => {
  const theme = useMantineTheme()
  const [capsuleColor, setCapsuleColor] = useState(theme.colors["brand"][3])
  const [gpsColor, setGpsColor] = useState("#000000")
  const [chosenEmoji, setChosenEmoji] = useState<EmojiClickData | null>(null)
  const [opened, setOpened] = useState(false)

  const capsuleColors = [
    theme.colors["brand"][3],
    "#9581F2",
    "#F1ABDD",
    "#EB5040",
    "#DE6437",
    "#F8D551",
    "#6BE58B",
    "#73E4E3",
    "#2351D5",
    "#000000",
    "#D3DAE1",
    "#FFFFFF",
  ]

  const gpsColors = ["#000000", "#FFFFFF"]

  const onEmojiClick = (emoji: EmojiClickData, event: MouseEvent) => {
    setChosenEmoji(emoji)
    setOpened(false)
  }

  return (
    <>
      <WalkthroughLayout title="カプセルを作ろう" totalStep={4} currentStep={0}>
        <CapsulePreview
          capsuleColor={capsuleColor}
          gpsColor={gpsColor}
          emoji={chosenEmoji ? chosenEmoji.emoji : "😄"}
        />
        <Box className="p-4">
          <Text color="white" weight="bold" size="sm">
            カプセルの色
          </Text>
          <ColorSelector colors={capsuleColors} onSelect={setCapsuleColor} />
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
          <ColorSelector colors={gpsColors} onSelect={setGpsColor} />
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
          theme={Theme.DARK}
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
