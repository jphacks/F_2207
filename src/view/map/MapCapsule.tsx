import { Feature } from "@/types/feature"

import Capsule from "../Capsule"

export type MapCapsuleProps = {
  feature: Feature
}

const MapCapsule: React.FC<MapCapsuleProps> = ({ feature }) => {
  // TODO: Click Action
  return (
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
      onClick={() => alert(`clicked on id ${feature.id}`)}
    />
  )
}

export default MapCapsule