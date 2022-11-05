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
import React, { useEffect, useState } from "react"
import { FiPlusCircle } from "react-icons/fi"
import { useRouter } from "next/router"

import WalkthroughLayout from "@/view/layout/walkthrough"
import UserAvater from "@/view/UserAvater"
import { useMatchingUsers, useMatchingWithRedirect } from "@/hooks/useMatching"
import { listenItemCount, moveToRegister, postItem } from "@/repository/items"
import { useUser } from "@/auth/useAuth"
import MetaHeader from "@/view/common/MetaHeader"
import { useAuthRouter } from "@/auth/useAuthRouter"

const useItemCount = (matchingId: string) => {
  useAuthRouter(true)
  const [postedItemCount, setPostedItemCount] = useState<Record<string, number>>({})

  useEffect(() => {
    const unsubscribe = listenItemCount(matchingId, (postedItem) => {
      setPostedItemCount((prev) => {
        const newItemCount = { ...prev }
        for (const userId of Object.keys(postedItem)) {
          newItemCount[userId] = (newItemCount[userId] ?? 0) + postedItem[userId]
        }
        return newItemCount
      })
    })
    return unsubscribe
  }, [matchingId])

  return postedItemCount
}

const Collect: NextPage = () => {
  const router = useRouter()
  const theme = useMantineTheme()
  const user = useUser()

  const matchingId = router.query.matchingId as string
  const matching = useMatchingWithRedirect(matchingId)
  const matchingUsers = useMatchingUsers(matchingId)
  const postedItemCount = useItemCount(matchingId)

  const isOwner = matching != null && user != null && matching.ownerId === user.id

  const [files, setFiles] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const handleAddFiles = async (addedFiles: File[]) => {
    if (user == null) {
      window.alert("ログインしてください")
      return
    }

    setFiles((prev) => [...prev, ...addedFiles])

    const previewUrls = addedFiles.map((file) => URL.createObjectURL(file))
    setPreviewImages((prev) => [...prev, ...previewUrls])

    try {
      await postItem({ user, matchingId }, addedFiles)
    } catch (e) {
      window.alert("エラーが発生しました")
    }
  }

  const previews = previewImages.map((url, index) => {
    return (
      <Image
        key={url}
        alt=""
        src={url}
        imageProps={{ onLoad: () => URL.revokeObjectURL(url) }}
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
    <>
      <MetaHeader title="写真・動画の選択">
        <link rel="prerender" href={`/capsule/${matchingId}/register`} />
      </MetaHeader>
      <WalkthroughLayout
        title="写真や動画を追加しよう"
        totalStep={4}
        currentStep={2}
        onClickNext={
          isOwner
            ? async () => {
                await moveToRegister(matchingId)
                router.push(`/capsule/${matchingId}/register`)
              }
            : null
        }
        onClickPrevOrClose={
          isOwner
            ? () => {
                router.push(`/capsule/create`)
              }
            : null
        }
      >
        <Box className="pt-10 pb-16">
          <Group spacing={10}>
            {matchingUsers.map((matchingUser) => (
              <UserAvater
                key={matchingUser.id}
                user={matchingUser}
                label={postedItemCount[matchingUser.id] ?? 0}
              />
            ))}
          </Group>
        </Box>
        <Text color="white" weight="bold" size="sm">
          あなたの写真や動画
        </Text>
        <Center>
          <SimpleGrid className="w-full pt-4" cols={3} spacing={3} verticalSpacing={3}>
            <FileButton
              key="addButton"
              onChange={handleAddFiles}
              accept="image/png,image/jpeg"
              multiple
            >
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
                    transition: "backgroundColor 1s",
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
    </>
  )
}

export default Collect
