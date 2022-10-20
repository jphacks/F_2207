import { Box, SimpleGrid, Text } from "@mantine/core"
import { NextPage } from "next"
import React from "react"

const Collect: NextPage = () => {
  return (
    <div>
      <Text>写真や動画を追加しよう</Text>
      <Text>あなたの写真や動画</Text>
      <SimpleGrid cols={3} spacing={3} verticalSpacing={3} sx={{ width: "75vw" }}>
        <Box component="button" sx={{ height: "25vw", width: "25vw" }} />
        <Box sx={{ height: "25vw", width: "25vw", background: "#ffffff" }} />
        <Box sx={{ height: "25vw", width: "25vw", background: "#ffffff" }} />
        <Box sx={{ height: "25vw", width: "25vw", background: "#ffffff" }} />
        <Box sx={{ height: "25vw", width: "25vw", background: "#ffffff" }} />
        <Box sx={{ height: "25vw", width: "25vw", background: "#ffffff" }} />
        <Box sx={{ height: "25vw", width: "25vw", background: "#ffffff" }} />
      </SimpleGrid>
    </div>
  )
}

export default Collect
