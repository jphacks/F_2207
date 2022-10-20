import { UnstyledButton, Text, Stack } from "@mantine/core"
import React from "react"

import CapsuleIcon from "./icons/CapsuleIcon"
import MapIcon from "./icons/MapIcon"
import NotificationIcon from "./icons/NotificationIcon"
import UserIcon from "./icons/UserIcon"

const BottomBar: React.FC = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 flex h-[72px] items-center bg-white">
      <UnstyledButton px={16} py={12} className="flex-1">
        <Stack align="center" spacing={4}>
          <MapIcon className="h-7 w-7" />
          <Text color="black" size={10}>
            マップ
          </Text>
        </Stack>
      </UnstyledButton>
      <UnstyledButton px={16} py={12} className="flex-1">
        <Stack align="center" spacing={4}>
          <CapsuleIcon className="h-7 w-7" />
          <Text color="black" size={10}>
            カプセル
          </Text>
        </Stack>
      </UnstyledButton>
      <UnstyledButton px={16} py={12} className="flex-1">
        <Stack align="center" spacing={4}>
          <NotificationIcon className="h-7 w-7" />
          <Text color="black" size={10}>
            通知
          </Text>
        </Stack>
      </UnstyledButton>
      <UnstyledButton px={16} py={12} className="flex-1">
        <Stack align="center" spacing={4}>
          <UserIcon className="h-7 w-7" />
          <Text color="black" size={10}>
            マイページ
          </Text>
        </Stack>
      </UnstyledButton>
    </div>
  )
}

export default BottomBar
