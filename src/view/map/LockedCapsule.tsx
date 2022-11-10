import { RingProgress, Stack, Text } from "@mantine/core"

import { Feature } from "@/types/feature"

export type LockedCapsuleProps = {
  feature: Feature
  className?: string
}

const LockedCapsule: React.FC<LockedCapsuleProps> = ({ feature, className }) => {
  const today = Date.now()
  const openDate = Date.parse(feature.properties.openDate)
  const addDate = Date.parse(feature.properties.addDate)

  const betweenDays = (start: number, end: number) => {
    return Math.floor((end - start) / 86400000)
  }

  return (
    <div className="pb-[150px]">
      <RingProgress
        size={120}
        thickness={12}
        className={className}
        sections={[
          {
            value: 100 - (betweenDays(today, openDate) / betweenDays(addDate, openDate)) * 100,
            color: "gray.8",
          },
          {
            value: (betweenDays(today, openDate) / betweenDays(addDate, openDate)) * 100,
            color: feature.properties.capsuleColor,
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
              {betweenDays(today, openDate)}日
            </Text>
          </Stack>
        }
      />
    </div>
  )
}

export default LockedCapsule
