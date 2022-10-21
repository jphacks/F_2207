import { Box, Group, Button, Text, Stack, ActionIcon } from "@mantine/core"
import React from "react"
import { FiX, FiChevronLeft } from "react-icons/fi"

export type WalkthroughLayoutProps = {
  title: string
  children: React.ReactNode
  totalStep: number
  currentStep: number
  onClickNext: (() => void) | null
  onClickPrevOrClose: (() => void) | null
  nextButtonType?: "default" | "bury"
}

const WalkthroughLayout: React.FC<WalkthroughLayoutProps> = ({
  title,
  children,
  totalStep,
  currentStep,
  onClickNext,
  onClickPrevOrClose,
  nextButtonType = "default",
}) => {
  return (
    <Box sx={{ minHeight: "100vh", height: "100%", backgroundColor: "#212121" }} p={20}>
      <Group className="w-full" position="apart">
        {onClickPrevOrClose != null ? (
          <ActionIcon aria-label="Close modal" size="lg" color="dark" onClick={onClickPrevOrClose}>
            {currentStep === 0 ? <FiX size={24} /> : <FiChevronLeft size={24} />}
          </ActionIcon>
        ) : (
          <div />
        )}
        {onClickNext != null ? (
          nextButtonType === "default" ? (
            <Button
              variant="subtle"
              size="md"
              color="brand.3"
              compact
              style={{ cursor: "pointer" }}
              onClick={onClickNext}
            >
              <Text weight={600} size="md">
                次へ
              </Text>
            </Button>
          ) : (
            <Button
              size="lg"
              color="brand.3"
              compact
              style={{ cursor: "pointer" }}
              onClick={onClickNext}
              className="rounded-full px-4"
            >
              <Text weight={600} size="sm" style={{ color: "black" }}>
                埋める
              </Text>
            </Button>
          )
        ) : (
          <div />
        )}
      </Group>
      <Stack mb={32} spacing={12}>
        <Group position="center" spacing={10}>
          {[...Array(totalStep)].map((_, i) => (
            <Box
              key={i}
              sx={(theme) => ({
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: currentStep === i ? "white" : theme.colors.gray[6],
              })}
            />
          ))}
        </Group>
        <Text color={"white"} align="center">
          {title}
        </Text>
      </Stack>

      {children}
    </Box>
  )
}

export default WalkthroughLayout
