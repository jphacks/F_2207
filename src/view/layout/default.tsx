import { Box, Button } from "@mantine/core"
import { NextLink } from "@mantine/next"
import React from "react"

export type DefaultLayoutProps = {
  children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <Box>
        <Button component={NextLink} href="/">
          Home
        </Button>
      </Box>
      {children}
    </>
  )
}

export default DefaultLayout
