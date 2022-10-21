import { useRouter } from "next/router"
import { Button, Modal } from "@mantine/core"
import { useState } from "react"

import { Feature } from "@/types/feature"

import Capsule from "../Capsule"

export type MapCapsuleProps = {
  feature: Feature
  onClick: () => void
}

const MapCapsule: React.FC<MapCapsuleProps> = ({ feature, onClick }) => {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  // TODO: Click Action
  return (
    <>
      <Capsule
        capsuleColor={feature.properties.capsuleColor}
        gpsColor={feature.properties.gpsColor}
        emoji={feature.properties.emoji}
        size="sm"
        lng={feature.geometry.coordinates[0]}
        lat={feature.geometry.coordinates[1]}
        bgSx={{
          boxShadow: "0px 2.7200000286102295px 33.31999969482422px 0px #FFFFFF40",
        }}
        onClick={() => setOpen(true)}
      />
      <Modal
        centered
        opened={open}
        onClose={() => setOpen(false)}
        withCloseButton={false}
        styles={{
          modal: {
            background: "#212121",
            color: "white",
          },
        }}
      >
        <div className="flex flex-col items-center">
          <div>このカプセルを探しに行きますか？</div>
          <Button
            className="mt-4 bg-[#d3f36b] text-black hover:bg-[#c8e762]"
            onClick={() => {
              setOpen(false)
              onClick()
            }}
          >
            探しに行く
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default MapCapsule
