import { Center } from "@mantine/core"

import Capsule from "./Capsule"

type CapsulePreviewProps = {
  capsuleColor: string
  gpsColor: string
  emoji: string
  lng: number
  lat: number
}

const CapsulePreview: React.FC<CapsulePreviewProps> = ({
  capsuleColor,
  gpsColor,
  emoji,
  lng,
  lat,
}) => {
  return (
    <Center sx={{ width: "100%" }}>
      <Capsule
        capsuleColor={capsuleColor}
        gpsColor={gpsColor}
        emoji={emoji}
        lng={lng}
        lat={lat}
        size="md"
        bgSx={{ boxShadow: "0px 4px 49px 0px #FFFFFF40" }}
      />
    </Center>
  )
}

export default CapsulePreview
