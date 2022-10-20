import { Box, Button } from "@mantine/core"
import { NextLink } from "@mantine/next"
import { FiPlus } from "react-icons/fi"

import DefaultLayout from "@/view/layout/default"
import SearchBar from "@/view/SearchBar"

import Map from "../../view/map/Map"

import type { NextPage } from "next"

const MapPage: NextPage = () => {
  return (
    <DefaultLayout>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <SearchBar />
        </Box>
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
            bottom: 32,
            right: 32,
            boxShadow: "0px 1px 6px 0px #84848442",
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FiPlus className="text-black" size={28} />
        </Button>
        <Map />
      </Box>
    </DefaultLayout>
  )
}

export default MapPage
