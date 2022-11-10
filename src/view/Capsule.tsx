import { Center, Sx, Text } from "@mantine/core"
import { MouseEventHandler } from "react"

import { convertLngLat } from "@/lib/convertLngLat"

type CapsuleSize = "xs" | "sm" | "md"

type CapsuleProps = {
  capsuleColor: string
  gpsColor: string
  emoji: string
  size: CapsuleSize
  lng: number
  lat: number
  bgSx?: Sx
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Capsule: React.FC<CapsuleProps> = ({
  capsuleColor,
  gpsColor,
  emoji,
  size,
  lng,
  lat,
  bgSx,
  onClick,
}) => {
  const getDiameter = (size: CapsuleSize) => {
    switch (size) {
      case "xs":
        return 60
      case "sm":
        return 102
      case "md":
        return 160
    }
  }

  const getEmojiSize = (size: CapsuleSize) => {
    switch (size) {
      case "xs":
        return 32
      case "sm":
        return 54.5
      case "md":
        return 80
    }
  }

  const getGpsSize = (size: CapsuleSize) => {
    switch (size) {
      case "xs":
        return 8
      case "sm":
        return 12.5
      case "md":
        return 18.5
    }
  }

  return (
    <Center
      sx={{
        backgroundColor: capsuleColor,
        color: gpsColor,
        width: getDiameter(size),
        height: getDiameter(size),
        borderRadius: "50%",
        position: "relative",
        cursor: onClick ? "pointer" : "auto",
        ...bgSx,
      }}
      onClick={onClick}
    >
      <Text size={getEmojiSize(size)}>{emoji}</Text>
      <Text
        sx={{
          zIndex: 10,
          fontSize: getGpsSize(size),
          lineHeight: 1,
          position: "absolute",
          textAlign: "center",
          fontFamily: "nagoda",
          textShadow: "0px 0px 3px #ffffff",
          whiteSpace: "pre-wrap",
        }}
      >
        {convertLngLat(lng, "lng").split("'")[0] +
          "'N" +
          "\n" +
          convertLngLat(lat, "lat").split("'")[0] +
          "'E"}
      </Text>
    </Center>
  )
}

export default Capsule
