import { RingProgress, Stack, Text } from "@mantine/core"

export type CapsuleDistanceProps = {
  capsuleColor: string
  distance: number
  className?: string
}

const CapsuleDistance: React.FC<CapsuleDistanceProps> = ({ capsuleColor, distance, className }) => {
  return (
    <RingProgress
      size={120}
      thickness={12}
      className={className}
      sections={[
        {
          value: (300 - distance) / 3,
          color: "gray.8",
        },
        {
          value: distance / 3,
          color: capsuleColor,
        },
      ]}
      label={
        <Stack
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[9],
            width: 120 - 12 * 4,
            height: 120 - 12 * 4,
            borderRadius: "50%",
            justifyContent: "center",
            gap: 0,
          })}
        >
          <Text
            sx={{
              fontSize: 10,
              fontWeight: 300,
              fontFamily: "Hiragino Sans",
              color: "white",
              textAlign: "center",
            }}
          >
            残り
          </Text>
          <Text
            sx={{
              fontSize: 18,
              fontWeight: 600,
              fontFamily: "Hiragino Sans",
              color: "white",
              textAlign: "center",
            }}
          >
            {distance.toFixed(1)}m
          </Text>
        </Stack>
      }
    />
  )
}

export default CapsuleDistance
