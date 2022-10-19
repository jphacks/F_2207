import { Stack, Avatar, Text } from "@mantine/core"
import React from "react"

import { AppUser } from "@/types/user"

export type UserAvaterProps = {
  user: AppUser
}

const UserAvater: React.FC<UserAvaterProps> = ({ user }) => {
  return (
    <Stack align="center" style={{ width: 80 }} spacing={12}>
      <Avatar src={user.iconUrl} style={{ width: 64, height: 64, borderRadius: "50%" }} />
      <Text size="xs" className="max-line w-full truncate" align="center">
        {user.name}
      </Text>
    </Stack>
  )
}

export default UserAvater
