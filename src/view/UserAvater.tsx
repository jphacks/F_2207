import { Indicator, Stack, Avatar, Text } from "@mantine/core"
import React from "react"

import { AppUser } from "@/types/user"

export type UserAvaterProps = {
  user: AppUser
  label?: number
}

const UserAvater: React.FC<UserAvaterProps> = ({ user, label }) => {
  return (
    <Stack align="center" style={{ width: 80 }} spacing={12}>
      <Indicator
        label={label}
        showZero={false}
        dot={false}
        inline
        size={32}
        offset={5}
        styles={(theme) => ({
          indicator: {
            border: "white 2px solid",
            backgroundColor: theme.colors.secondary[5],
            color: theme.colors.gray[9],
            fontWeight: "bold",
          },
        })}
      >
        <Avatar src={user.iconUrl} style={{ width: 64, height: 64, borderRadius: "50%" }} />
      </Indicator>
      <Text size="xs" className="max-line w-full truncate" align="center">
        {user.name}
      </Text>
    </Stack>
  )
}

export default UserAvater
