import { Box, Button, Text } from "@mantine/core"
import { NextLink } from "@mantine/next"

import Map from "../../view/Map"

import type { NextPage } from "next"

const MapPage: NextPage = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <Button
        component={NextLink}
        href="/cupsel/create"
        color="brand.3"
        radius="xl"
        size="xl"
        compact
        sx={{
          position: "absolute",
          zIndex: 10,
          bottom: "30px",
          right: "30px",
          boxShadow: "0px 1px 6px 0px #84848442",
        }}
      >
        <Text color="gray.9">+</Text>
      </Button>
      <Map />
    </Box>
  )
}

export default MapPage
