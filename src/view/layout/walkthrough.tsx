import { Box, Group, Button, Text, CloseButton, Stack } from "@mantine/core"
import React from "react"

export type WalkthroughLayoutProps = {
  title: string
  children: React.ReactNode
  totalStep: number
  currentStep: number
}

const WalkthroughLayout: React.FC<WalkthroughLayoutProps> = ({
  title,
  children,
  totalStep,
  currentStep,
}) => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#212121" }}>
      <Group className="w-full p-4" position="apart">
        <CloseButton aria-label="Close modal" size="xl" color="dark" />
        <Button variant="subtle" size="md" color="brand.3" compact style={{ cursor: "pointer" }}>
          <Text weight={600}>次へ</Text>
        </Button>
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
