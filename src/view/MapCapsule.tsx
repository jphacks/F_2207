import { Feature } from "@/types/feature"

import Capsule from "./Capsule"

export type MapCapsuleProps = {
  feature: Feature
}

const MapCapsule: React.FC<MapCapsuleProps> = ({ feature }) => {
  return (
    <Capsule
      capsuleColor={feature.properties.capsuleColor}
      gpsColor={feature.properties.gpsColor}
      emoji={feature.properties.emoji}
      size="sm"
      bgSx={{
        boxShadow: "0px 2.7200000286102295px 33.31999969482422px 0px #FFFFFF40",
      }}
    />
  )
}

export default MapCapsule
