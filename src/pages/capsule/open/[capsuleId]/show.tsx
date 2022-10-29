import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Loader, SimpleGrid, Image } from "@mantine/core"

import { useCapsule } from "@/hooks/useCapsule"
import Capsule from "@/view/Capsule"
import { fetchItems } from "@/repository/items"

const Show: NextPage = () => {
  const router = useRouter()
  const capsuleId = router.query.capsuleId as string
  const capsule = useCapsule(capsuleId)
  const [items, setItems] = useState<{ id: string; itemurl: string }[]>([])

  useEffect(() => {
    ;(async () => {
      const items = await fetchItems(capsuleId)
      console.log(items)
      setItems(items)
    })()
  }, [capsuleId])

  if (capsule == null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader aria-label="ロード中" />
      </div>
    )
  } else {
    return (
      <div className="mt-[64px] w-screen">
        <div className="flex flex-col items-center justify-center">
          <Capsule
            capsuleColor={capsule.color}
            gpsColor={capsule.gpsTextColor}
            emoji={capsule.emoji}
            size="sm"
            lng={capsule.longitude}
            lat={capsule.latitude}
            bgSx={{
              boxShadow: "0px 2.7200000286102295px 33.31999969482422px 0px #FFFFFF40",
            }}
            onClick={() => {}}
          />
          <p className="text-xl font-bold text-white">{capsule.title}</p>
        </div>
        <div>
          <SimpleGrid className="w-full pt-4" cols={3} spacing={3} verticalSpacing={3}>
            {items.map(({ itemurl }) => (
              <Image
                key={itemurl}
                alt=""
                src={itemurl}
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
            ))}
          </SimpleGrid>
          <div className="px-8">
            <h3>みんなのコメント</h3>
            <div>
              {capsule.memo.map((memo) => (
                <div key={memo}>{memo.split(":").slice(1).join("")}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Show
