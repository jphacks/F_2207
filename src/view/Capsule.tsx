import { Center, Sx, Text } from "@mantine/core"
import { MouseEventHandler } from "react"

type CapsuleSize = "sm" | "md"

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
        {"41°24'12.2\"N 2°10'26.5\"E"}
      </Text>
    </Center>
  )
}

export default Capsule
