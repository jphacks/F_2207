import { Box, Button, Text, useMantineTheme } from "@mantine/core"

import ColorSelector from "@/view/ CapsuleColorSelector"

import type { NextPage } from "next"

const CapsuleAdd: NextPage = () => {
  const theme = useMantineTheme()
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

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#212121" }}>
      <Text color={"white"}>カプセルを作ろう</Text>
      <Box className="p-4">
        <Text color={"white"}>カプセルの色</Text>
        <ColorSelector colors={capsuleColors} onSelect={() => {}} />
      </Box>
      <Box className="p-4">
        <Text color={"white"}>絵文字</Text>
        <Button className="mt-4" fullWidth color="gray">
          😄カプセル絵文字を変更する
        </Button>
      </Box>
      <Box className="p-4">
        <Text color={"white"}>GPSの色</Text>
        <ColorSelector colors={gpsColors} onSelect={() => {}} />
      </Box>
    </Box>
  )
}

export default CapsuleAdd
