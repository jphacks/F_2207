import { Box, Button, UnstyledButton } from "@mantine/core"
import { NextLink } from "@mantine/next"
import { FiPlus } from "react-icons/fi"
import { useCallback, useEffect, useMemo, useState } from "react"
import classNames from "classnames"
import { LngLatLike } from "mapbox-gl"

import DefaultLayout from "@/view/layout/default"
import SearchBar from "@/view/SearchBar"
import MetaHeader from "@/view/common/MetaHeader"
import { fetchCapsules } from "@/repository/capsule"
import { useUser } from "@/auth/useAuth"
import SearchResult from "@/view/SearchResult"
import { Capsule } from "@/types/capsule"
import { useCapsuleFuzzySearch } from "@/lib/capsuleFuzzySearch"
import { useAuthRouter } from "@/auth/useAuthRouter"

import Map from "../../view/map/Map"

import type { NextPage } from "next"

const MapPage: NextPage = () => {
  const user = useUser()
  useAuthRouter(true)

  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [isFocusSerachBar, setIsFocusSerachBar] = useState(false)

  const [selectedCapsuleCenter, setSelectedCapsuleCenter] = useState<LngLatLike | null>(null)

  const handleSelectCapsule = useCallback(
    (capsuleId: string) => {
      setIsFocusSerachBar(false)
      setSearchInput("")

      const capsule = capsules.find(({ id }) => id === capsuleId)
      const lat = capsule?.latitude
      const lng = capsule?.longitude
      if (lat == null || lng == null) {
        return
      }
      setSelectedCapsuleCenter({ lat, lng })
    },
    [capsules],
  )

  useEffect(() => {
    if (user == null) {
      return
    }
    ;(async () => {
      const capsules = await fetchCapsules(user)
      setCapsules(capsules)
    })()
  }, [user])

  const keywords = useMemo(
    () =>
      capsules
        .map(({ keywords }) => keywords)
        .flat()
        .filter((keyword) => keyword != null && keyword !== ""),
    [capsules],
  )

  const searchResult = useCapsuleFuzzySearch(capsules, searchInput)

  const showSearchPage = isFocusSerachBar || 1 <= searchInput.length

  return (
    <>
      <MetaHeader title="マップ" />
      <DefaultLayout>
        <Box sx={{ position: "relative", height: "100%" }}>
          <Box
            sx={{
              position: "absolute",
              top: 20,
              zIndex: 700,
              width: "100%",
            }}
            className="transition-all"
          >
            <div className="w-full px-4">
              <div className="relative w-full">
                <SearchBar
                  value={searchInput}
                  onChange={setSearchInput}
                  onClickBack={
                    showSearchPage
                      ? () => {
                          setIsFocusSerachBar(false)
                          setSearchInput("")
                        }
                      : undefined
                  }
                  showProfileIcon={!showSearchPage}
                  onFocus={() => setIsFocusSerachBar(true)}
                />
              </div>
            </div>
            {!showSearchPage && (
              <div className="flex w-full items-center space-x-2 overflow-x-scroll py-2.5 px-4">
                {keywords.map((keyword) => (
                  <UnstyledButton
                    key={keyword}
                    onClick={() => setSearchInput(`tag:${keyword}`)}
                    className="px-4 py-2 text-sm font-bold text-gray-900 bg-white border-none rounded-full shrink-0 shadow-main"
                  >
                    {keyword}
                  </UnstyledButton>
                ))}
              </div>
            )}
          </Box>
          <Button
            component={NextLink}
            href="/capsule/create"
            color="brand.3"
            radius="xl"
            size="xl"
            compact
            sx={{
              position: "absolute",
              zIndex: 500,
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
            <FiPlus className="text-black" size={28} aria-label="カプセルの新規作成" />
          </Button>
          <Map selectedCapsuleCenter={selectedCapsuleCenter} />
          <div
            className={classNames(
              showSearchPage ? "" : "pointer-events-none opacity-0",
              "transition",
            )}
          >
            <SearchResult
              capsules={searchResult}
              onClickCapsule={handleSelectCapsule}
              className="absolute inset-0 z-[600]"
            />
          </div>
        </Box>
      </DefaultLayout>
    </>
  )
}

export default MapPage
