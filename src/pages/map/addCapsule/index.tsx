import { Box, Text, useMantineTheme } from "@mantine/core"

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
      <Text color={"white"}>カプセルの色</Text>
      <ColorSelector colors={capsuleColors} onSelect={() => {}} />
      <Text color={"white"}>GPSの色</Text>
      <ColorSelector colors={gpsColors} onSelect={() => {}} />
    </Box>
  )
}

export default CapsuleAdd
