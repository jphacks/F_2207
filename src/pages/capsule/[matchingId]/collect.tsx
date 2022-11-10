import {
  Box,
  Center,
  FileButton,
  Group,
  Image,
  Loader,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core"
import { NextPage } from "next"
import React, { useEffect, useState } from "react"
import { FiPlusCircle } from "react-icons/fi"
import { useRouter } from "next/router"
import { AiOutlineVideoCamera } from "react-icons/ai"

import WalkthroughLayout from "@/view/layout/walkthrough"
import UserAvater from "@/view/UserAvater"
import { useMatchingUsers, useMatchingWithRedirect } from "@/hooks/useMatching"
import { listenItems, moveToRegister, postItem } from "@/repository/items"
import { useUser } from "@/auth/useAuth"
import MetaHeader from "@/view/common/MetaHeader"
import { useAuthRouter } from "@/auth/useAuthRouter"
import { generateId } from "@/lib/generateId"
import { Item } from "@/types/item"

const useItemCount = ({ userId, matchingId }: { userId: string; matchingId: string }) => {
  const [postedItems, setPostedItems] = useState<Item[]>([])
  const [postedItemCount, setPostedItemCount] = useState<Record<string, number>>({})

  useEffect(() => {
    const unsubscribe = listenItems(matchingId, (postedItems) => {
      setPostedItemCount((prev) => {
        const newItemCount = { ...prev }
        for (const item of postedItems) {
          newItemCount[item.createdBy] = (newItemCount[item.createdBy] ?? 0) + 1
        }
        return newItemCount
      })
      setPostedItems((prev) => [...postedItems, ...prev])
    })
    return unsubscribe
  }, [matchingId, userId])

  return { postedItems, postedItemCount }
}

const Collect: NextPage = () => {
  useAuthRouter(true)

  const router = useRouter()
  const theme = useMantineTheme()
  const user = useUser()

  const matchingId = router.query.matchingId as string
  const matching = useMatchingWithRedirect(matchingId)
  const matchingUsers = useMatchingUsers(matchingId)
  const { postedItems, postedItemCount } = useItemCount({ matchingId, userId: user?.id as string })

  const isOwner = matching != null && user != null && matching.ownerId === user.id

  const [previewImages, setPreviewImages] = useState<{ id: string; url: string }[]>([])

  const handleAddFiles = async (addedFiles: File[]) => {
    if (user == null) {
      window.alert("ログインしてください")
      return
    }

    const files = addedFiles.map((file) => ({
      id: generateId(),
      url: URL.createObjectURL(file),
      file,
    }))
    setPreviewImages((prev) => [...files, ...prev])

    try {
      await postItem({ user, matchingId }, files)
    } catch (e) {
      console.error(e)
      window.alert("エラーが発生しました")
    }
  }

  const previews = previewImages.map(({ id, url }) => {
    const postedItem = postedItems.find((item) => item.id === id)
    const postCompleted = postedItem != null
    return (
      <div key={id} className="relative">
        <Image
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
        {postedItem?.mimeType?.startsWith("video") && (
          <div className="absolute top-2 right-2 text-white">
            <AiOutlineVideoCamera />
          </div>
        )}
        {!postCompleted && (
          <>
            <div className="absolute inset-0 animate-pulse bg-gray-900/50" />
            <Loader
              color="white"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
            />
          </>
        )}
      </div>
    )
  })

  const previousPostedPreviews = postedItems
    .filter((item) => item.createdBy === user?.id)
    .map((item) => {
      const isPreviousPosted = !previewImages.find(({ id }) => id === item.id)
      if (!isPreviousPosted) {
        return null
      }
      const isVideo = item?.mimeType?.startsWith("video")

      return (
        <div key={item.id} className="relative">
          {isVideo ? (
            <video
              src={item.itemUrl}
              className="aspect-square h-full w-full object-cover"
              muted
              playsInline
              autoPlay
            />
          ) : (
            <Image
              alt=""
              src={item.itemUrl}
              imageProps={{ onLoad: () => URL.revokeObjectURL(item.itemUrl) }}
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
          )}
          {isVideo && (
            <div className="absolute top-2 right-2 text-white">
              <AiOutlineVideoCamera />
            </div>
          )}
        </div>
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
                label={
                  <span>
                    {postedItemCount[matchingUser.id] ?? 0}
                    <span className="text-[0.8em]">枚</span>
                  </span>
                }
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
              accept="image/png,image/jpeg,image/gif,video/webm,video/mpeg,video/mp4"
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
            {previousPostedPreviews}
          </SimpleGrid>
        </Center>
      </WalkthroughLayout>
    </>
  )
}

export default Collect
