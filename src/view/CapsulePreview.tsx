import { Center, Text } from "@mantine/core"

type CapsulePreviewProps = {
  capsuleColor: string
  gpsColor: string
  emoji: string
}

const CapsulePreview: React.FC<CapsulePreviewProps> = ({ capsuleColor, gpsColor, emoji }) => {
  return (
    <Center style={{ width: "100vw" }}>
      <Center
        style={{
          backgroundColor: capsuleColor,
          color: gpsColor,
          width: "160px",
          height: "160px",
          borderRadius: "80px",
          position: "relative",
          boxShadow: "0px 4px 49px 0px #FFFFFF40",
        }}
      >
        <Text size={80}>{emoji}</Text>
        <Text style={{ zIndex: 10, position: "absolute", textAlign: "center" }}>
          {"41°24'12.2\"N 2°10'26.5\"E"}
        </Text>
      </Center>
    </Center>
  )
}

export default CapsulePreview
