import { Center, Sx, Text } from "@mantine/core"
import { MouseEventHandler } from "react"

type CapsuleSize = "sm" | "md"

type LngLat = "lng" | "lat"

type CapsuleProps = {
  capsuleColor: string
  gpsColor: string
  emoji: string
  size: CapsuleSize
  bgSx?: Sx
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Capsule: React.FC<CapsuleProps> = ({
  capsuleColor,
  gpsColor,
  emoji,
  size,
  bgSx,
  onClick,
}) => {
  const getDiameter = (size: CapsuleSize) => {
    switch (size) {
      case "sm":
        return 102
      case "md":
        return 160
    }
  }

  const getEmojiSize = (size: CapsuleSize) => {
    switch (size) {
      case "sm":
        return 54.5
      case "md":
        return 80
    }
  }

  const getGpsSize = (size: CapsuleSize) => {
    switch (size) {
      case "sm":
        return 12.5
      case "md":
        return 18.5
    }
  }

  const convertLongLat = (num: number, type: LngLat) => {
    const degree = Math.floor(num)
    const minute = Math.floor((num - degree) * 60)
    const second = ((num - degree - minute / 60) * 3600).toFixed(1)
    var symbol = ""
    if (type == "lng" && num < 0) {
      symbol = "S"
    } else if (type == "lng" && num >= 0) {
      symbol = "N"
    } else if (type == "lat" && num < 0) {
      symbol = "W"
    } else if (type == "lat" && num >= 0) {
      symbol = "E"
    }

    return `${degree}°${minute}'${second}\"${symbol}`
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
        }}
      >
        {convertLongLat(34.97853204635202, "lng")}
        {"\n"}
        {convertLongLat(135.73299472077852, "lat")}
      </Text>
    </Center>
  )
}

export default Capsule
