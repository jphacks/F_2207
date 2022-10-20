import { Box, Center, SimpleGrid, Text } from "@mantine/core"
import { NextPage } from "next"
import React from "react"

import WalkthroughLayout from "@/view/layout/walkthrough"

const Collect: NextPage = () => {
  return (
    <WalkthroughLayout
      title="写真や動画を追加しよう"
      totalStep={4}
      currentStep={2}
      onClickNext={() => {}}
      onClickPrevOrClose={() => {}}
    >
      <Text color="white" weight="bold" size="sm">
        あなたの写真や動画
      </Text>
      <Center>
        <SimpleGrid className="pt-4" cols={3} spacing={3} verticalSpacing={3}>
          <Box component="button" sx={{ height: "30vw", width: "30vw" }} />
          <Box sx={{ height: "30vw", width: "30vw", background: "#ffffff" }} />
          <Box sx={{ height: "30vw", width: "30vw", background: "#ffffff" }} />
          <Box sx={{ height: "30vw", width: "30vw", background: "#ffffff" }} />
          <Box sx={{ height: "30vw", width: "30vw", background: "#ffffff" }} />
          <Box sx={{ height: "30vw", width: "30vw", background: "#ffffff" }} />
          <Box sx={{ height: "30vw", width: "30vw", background: "#ffffff" }} />
        </SimpleGrid>
      </Center>
    </WalkthroughLayout>
  )
}

export default Collect
