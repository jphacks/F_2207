import {
  Box,
  Center,
  FileButton,
  Group,
  Image,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core"
import { NextPage } from "next"
import React, { useState } from "react"
import { FiPlusCircle } from "react-icons/fi"
import { useRouter } from "next/router"

import WalkthroughLayout from "@/view/layout/walkthrough"
import UserAvater from "@/view/UserAvater"

const Collect: NextPage = () => {
  const router = useRouter()
  const matchingId = router.query.matchingId as string
  const theme = useMantineTheme()
  const [files, setFiles] = useState<File[]>([])

  // TODO:本当はいい感じにとってくる
  const users = [
    {
      id: "test",
      name: "user name",
      iconUrl:
        "https://lh3.googleusercontent.com/a/ALm5wu3m4M-U62i3Z8U7BlyEJX4h4bzX4rIrhz3aI5m3=s96-c",
    },
  ]

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
        styles={{
          figure: {
            width: "100%",
            height: "100%",
          },
          imageWrapper: {
            aspectRatio: "1 / 1",
            width: "100%",
            height: "100%",
          },
        }}
        height="100%"
        width="100%"
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
      <Box className="pt-10 pb-16">
        <Group spacing={10}>
          {users.map((user) => (
            <UserAvater key={user.id} user={user} label={12} />
          ))}
        </Group>
      </Box>
      <Text color="white" weight="bold" size="sm">
        あなたの写真や動画
      </Text>
      <Center>
        <SimpleGrid className="w-full pt-4" cols={3} spacing={3} verticalSpacing={3}>
          <FileButton key="addButton" onChange={addFiles} accept="image/png,image/jpeg" multiple>
            {(props) => (
              <Box
                component="button"
                {...props}
                sx={(theme) => ({
                  height: "100%",
                  width: "100%",
                  backgroundColor: theme.colors.gray[8],
                  border: "none",
                  aspectRatio: "1 / 1",
                  "&:hover": {
                    backgroundColor: theme.colors.gray[6],
                    cursor: "pointer",
                  },
                  "&:focus": {
                    backgroundColor: theme.colors.gray[8],
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
