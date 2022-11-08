import React from "react"
import { Button, Drawer, Text, Center } from "@mantine/core"
import { NextLink } from "@mantine/next"

import { Capsule } from "@/types/capsule"

import CapsulComponent from "./Capsule"

export type DiscoverDrawerPorps = {
  open: boolean
  onClose: () => void
  href: string
  capsule: Capsule
}

const DiscoverDrawer: React.FC<DiscoverDrawerPorps> = ({ open, onClose, capsule, href }) => {
  return (
    <Drawer
      opened={open}
      onClose={onClose}
      padding="xl"
      size={300}
      withCloseButton={false}
      position="bottom"
      styles={{
        drawer: {
          borderRadius: "12px 12px 0 0",
        },
      }}
    >
      <div className="my-8 flex items-center">
        <div className="h-20 w-20 shrink-0">
          <CapsulComponent
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
        </div>
        <Center style={{ width: "100%" }} px={16}>
          <Text color="white" weight="bold">
            タイムカプセルを見つけました
          </Text>
        </Center>
      </div>
      <Button
        component={NextLink}
        href={href}
        color="brand.3"
        // onClick={onOpenCapsule}
        fullWidth
        size="md"
        mt={48}
      >
        <Text color="black">開ける</Text>
      </Button>
    </Drawer>
  )
}

export default DiscoverDrawer
