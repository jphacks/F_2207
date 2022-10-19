import { Box, Button, Center, Drawer, Text, useMantineTheme } from "@mantine/core"
import { useState } from "react"
import Picker from "emoji-picker-react"

import ColorSelector from "@/view/ CapsuleColorSelector"
import CapsulePreview from "@/view/CapsulePreview"

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
    <Box sx={{ minHeight: "100vh", backgroundColor: "#212121" }}>
      <Text className="mb-8" color={"white"} align="center">
        カプセルを作ろう
      </Text>
      <CapsulePreview
        capsuleColor={capsuleColor}
        gpsColor={gpsColor}
        emoji={chosenEmoji ? chosenEmoji.emoji : "😄"}
      />
      <Box className="p-4">
        <Text color={"white"}>カプセルの色</Text>
        <ColorSelector colors={capsuleColors} onSelect={setCapsuleColor} />
      </Box>
      <Box className="p-4">
        <Text color={"white"}>絵文字</Text>
        <Button className="mt-4" fullWidth color="gray" onClick={() => setOpened(true)}>
          😄カプセル絵文字を変更する
        </Button>
        <Drawer opened={opened} onClose={() => setOpened(false)} size="xl" position="bottom">
          <Center>
            <Picker onEmojiClick={onEmojiClick} />
          </Center>
        </Drawer>
      </Box>
      <Box className="p-4">
        <Text color={"white"}>GPSロゴの色</Text>
        <ColorSelector colors={gpsColors} onSelect={setGpsColor} />
      </Box>
    </Box>
  )
}

export default CapsuleAdd
