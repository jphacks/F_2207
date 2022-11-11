import { NextPage } from "next"
import { useState, useEffect } from "react"
import axios from "axios"
import { UnstyledButton, Text, Modal, Button } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useRouter } from "next/router"

import { useUser } from "@/auth/useAuth"
import { useCapsuleFuzzySearch } from "@/lib/capsuleFuzzySearch"
import { deleteCapsule, fetchCapsules } from "@/repository/capsule"
import { Capsule } from "@/types/capsule"
import { formatDate } from "@/lib/date"
import CapsuleComponent from "@/view/Capsule"
import SearchBar from "@/view/SearchBar"
import { Feature } from "@/types/feature"

const AdminPage: NextPage = () => {
  const router = useRouter()
  const user = useUser()
  const [opened, setOpened] = useState(false)
  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>()
  const [searchInput, setSearchInput] = useState("")
  const searchResult = useCapsuleFuzzySearch(capsules, searchInput)

  useEffect(() => {
    if (user == null) {
      return
    }
    ;(async () => {
      const capsules = await fetchCapsules(user)
      setCapsules(capsules)
    })()
  }, [user])

  const handleDeleteCapsule = (id: string) => {
    if (user == null) {
      return
    }
    axios
      .get(
        `https://prod-mqplatform-api.azure-api.net/maps-api/layers/v1/18?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
      )
      .then((res) => {
        res.data.forEach((layer: any) => {
          if (layer.name == user.id) {
            axios
              .get(
                `https://prod-mqplatform-api.azure-api.net/maps-api/features/v1/18/${layer.id}?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
              )
              .then((res) => {
                res.data.features.forEach((feature: Feature) => {
                  if (feature.properties.id == id) {
                    axios
                      .delete(
                        `https://prod-mqplatform-api.azure-api.net/maps-api/features/v1/18/${layer.id}/${feature.id}?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
                      )
                      .then((res) => {
                        // これ失敗したらどうなるかわからん
                        deleteCapsule({ capsuleId: id })
                        setSelectedCapsule(null)
                        setOpened(false)
                        alert("削除成功")
                      })
                      .catch((err) => {
                        alert("削除失敗")
                        console.log(err)
                      })
                  }
                })
              })
          }
        })
      })
  }

  const form = useForm({
    initialValues: {
      longitude: 0,
      latitude: 0,
    },
  })

  return (
    <>
      <div className="w-full px-4">
        <div className="relative w-full">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onClickBack={undefined}
            showProfileIcon={false}
            onFocus={() => {}}
          />
        </div>
      </div>
      {searchResult.map((capsule) => (
        <UnstyledButton
          key={capsule.id}
          onClick={() => {
            setOpened(true)
            setSelectedCapsule(capsule)
          }}
          className="flex w-full items-center space-x-4"
        >
          <CapsuleComponent
            capsuleColor={capsule.color}
            gpsColor={capsule.gpsTextColor}
            emoji={capsule.emoji}
            size="xs"
            lng={capsule.longitude}
            lat={capsule.latitude}
          />
          <div className="flex flex-col justify-center">
            <Text size={18} color="white">
              {capsule.title}
            </Text>
            {/* TODO: replace dummy date */}
            <Text size={14}>京都府京都市吉田本町付近・{formatDate(capsule.addDate)}</Text>
          </div>
        </UnstyledButton>
      ))}
      <Modal
        opened={opened && selectedCapsule != null && selectedCapsule != undefined}
        onClose={() => setOpened(false)}
        title="削除しますか？"
      >
        <Button onClick={() => setOpened(false)}>いいえ</Button>
        <Button onClick={() => handleDeleteCapsule(selectedCapsule!.id)}>はい</Button>
      </Modal>
    </>
  )
}

export default AdminPage
