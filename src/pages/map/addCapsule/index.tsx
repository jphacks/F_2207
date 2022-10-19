import { Box } from "@mantine/core"

import CapsuleColorSelector from "@/view/ CapsuleColorSelector"

import type { NextPage } from "next"

const CapsuleAdd: NextPage = () => {
  return (
    <Box>
      カプセル追加画面
      <CapsuleColorSelector />
    </Box>
  )
}

export default CapsuleAdd
