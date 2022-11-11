import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Loader, SimpleGrid, ActionIcon, Text, Avatar } from "@mantine/core"
import { FiChevronLeft, FiMoreVertical } from "react-icons/fi"
import { AiOutlineCalendar, AiOutlineDownload, AiOutlineMessage } from "react-icons/ai"

import { useCapsule } from "@/hooks/useCapsule"
import Capsule from "@/view/Capsule"
import { fetchItems } from "@/repository/items"
import MetaHeader from "@/view/common/MetaHeader"
import { formatDate } from "@/lib/date"
import PreviewItem from "@/pages/PreviewItem"
import { Item } from "@/types/item"

const Show: NextPage = () => {
  const router = useRouter()
  const capsuleId = router.query.capsuleId as string
  const capsule = useCapsule(capsuleId)
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    ;(async () => {
      const items = await fetchItems(capsuleId)
      console.log(items)
      setItems(items)
    })()
  }, [capsuleId])

  if (capsule == null) {
    return (
      <>
        <MetaHeader title="ロード中" disableIndex />
        <div className="fixed inset-0 flex items-center justify-center">
          <Loader aria-label="ロード中" />
        </div>
      </>
    )
  } else {
    return (
      <>
        <MetaHeader title={capsule.title} disableIndex />
        <div className="w-screen px-5">
          <div className="sticky inset-x-0 top-0 z-20 flex w-full items-start justify-between bg-bgcolor pt-5 pb-2">
            <ActionIcon onClick={() => router.push("/map")}>
              <FiChevronLeft size={36} />
            </ActionIcon>
            <div className="flex flex-col items-center text-white">
              <Text size="lg" weight="bold">
                {capsule.title}
              </Text>
              <Text size="xs">東京都丘高校付近・{formatDate(capsule.addDate)}に作成</Text>
            </div>
            <ActionIcon>
              <FiMoreVertical size={24} />
            </ActionIcon>
          </div>
          <div className="flex flex-col items-center justify-center py-10">
            <Capsule
              capsuleColor={capsule.color}
              gpsColor={capsule.gpsTextColor}
              emoji={capsule.emoji}
              size="xs2"
              lng={capsule.longitude}
              lat={capsule.latitude}
              bgSx={{
                boxShadow: "0px 2.7200000286102295px 33.31999969482422px 0px #FFFFFF40",
              }}
              onClick={() => {}}
            />
          </div>
          <div className="pb-10">
            <div className="flex">
              <AiOutlineMessage size={24} className="mr-2 text-primary" />
              <Text size="lg" component="h2" weight="bold" className="m-0 text-primary">
                あなたへのメッセージ
              </Text>
            </div>
            <div className="mt-2 flex flex-col space-y-[1px] overflow-hidden rounded-lg">
              {capsule.memo.map((memo) => {
                const [userId, ...body] = memo.split(":")
                return (
                  <div key={userId} className="flex items-center space-x-3 bg-[#424242] p-3">
                    <Avatar src={userId} />
                    <p className="m-0 block text-sm text-white line-clamp-2">{body.join("")}</p>
                  </div>
                )
              })}
              <div className="flex items-center space-x-3 bg-[#424242] p-3">
                <Avatar src="" />
                <p className="m-0 block text-sm text-white line-clamp-2">hello</p>
              </div>
            </div>
            <div className="mt-10 flex items-center">
              <div className="mr-2 h-6 w-6">
                <AiOutlineCalendar size={24} className="text-primary" />
              </div>
              <Text
                component="h2"
                weight="bold"
                size="xl"
                className="m-0 w-full font-bold leading-none text-primary"
                style={{ fontFamily: "nagoda" }}
              >
                {capsule.addDate.getFullYear()}.{capsule.addDate.getMonth() + 1}.
                {capsule.addDate.getDate()}
              </Text>
              <ActionIcon>
                <AiOutlineDownload size={24} />
              </ActionIcon>
            </div>
            <SimpleGrid className="w-full pt-4" cols={2} spacing={4} verticalSpacing={4}>
              {items.map(({ id, itemUrl, mimeType }) => (
                <PreviewItem key={id} url={itemUrl} isVideo={mimeType.startsWith("video")} />
              ))}
            </SimpleGrid>
          </div>
        </div>
      </>
    )
  }
}

export default Show
