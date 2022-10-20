import { Center } from "@mantine/core"

import Capsule from "./Capsule"

type CapsulePreviewProps = {
  capsuleColor: string
  gpsColor: string
  emoji: string
}

const CapsulePreview: React.FC<CapsulePreviewProps> = ({ capsuleColor, gpsColor, emoji }) => {
  return (
    <Center sx={{ width: "100%" }}>
      <Capsule
        capsuleColor={capsuleColor}
        gpsColor={gpsColor}
        emoji={emoji}
        size="md"
        bgSx={{ boxShadow: "0px 4px 49px 0px #FFFFFF40" }}
      />
    </Center>
  )
}

export default CapsulePreview
