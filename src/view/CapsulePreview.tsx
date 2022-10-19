import { Center, Text } from "@mantine/core"

type CapsulePreviewProps = {
  capsuleColor: string
  gpsColor: string
  emoji: string
}

const CapsulePreview: React.FC<CapsulePreviewProps> = ({ capsuleColor, gpsColor, emoji }) => {
  return (
    <Center sx={{ width: "100%" }}>
      <Center
        sx={{
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
        <Text
          sx={{
            zIndex: 10,
            fontSize: 18.5,
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
    </Center>
  )
}

export default CapsulePreview
