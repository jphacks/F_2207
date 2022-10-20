import { Box, Center, FileButton, Image, SimpleGrid, Text, useMantineTheme } from "@mantine/core"
import { NextPage } from "next"
import React, { useState } from "react"
import { FiPlusCircle } from "react-icons/fi"
import { useRouter } from "next/router"

import WalkthroughLayout from "@/view/layout/walkthrough"

const Collect: NextPage = () => {
  const router = useRouter()
  const matchingId = router.query.matchingId as string
  const theme = useMantineTheme()
  const [files, setFiles] = useState<File[]>([])

  const addFiles = (addedFiles: File[]) => {
    setFiles((prev) => [...prev, ...addedFiles])
  }

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <Image
        key={index}
        alt={file.name}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        height="30vw"
        width="30vw"
      />
    )
  })

  return (
    <WalkthroughLayout
      title="写真や動画を追加しよう"
      totalStep={4}
      currentStep={2}
      onClickNext={() => {
        router.push(`/cupsel/${matchingId}/register`)
      }}
      onClickPrevOrClose={() => {
        router.push(`/cupsel/create`)
      }}
    >
      <Text color="white" weight="bold" size="sm">
        あなたの写真や動画
      </Text>
      <Center>
        <SimpleGrid className="pt-4" cols={3} spacing={3} verticalSpacing={3}>
          <FileButton key="addButton" onChange={addFiles} accept="image/png,image/jpeg" multiple>
            {(props) => (
              <Box
                component="button"
                {...props}
                sx={(theme) => ({
                  height: "30vw",
                  width: "30vw",
                  backgroundColor: theme.colors.gray[8],
                  border: "none",
                  "&:hover": {
                    backgroundColor: theme.colors.gray[6],
                    cursor: "pointer",
                  },
                })}
              >
                <FiPlusCircle size={36} color={theme.colors.gray[4]} />
              </Box>
            )}
          </FileButton>
          {previews}
        </SimpleGrid>
      </Center>
    </WalkthroughLayout>
  )
}

export default Collect
