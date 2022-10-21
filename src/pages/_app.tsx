import "../styles/globals.css"
import { SWRConfig } from "swr"
import { MantineProvider } from "@mantine/core"
import React, { useState } from "react"

import { AuthProvider } from "@/auth/useAuth"
import Loading from "@/auth/Loading"
import MatchingDialog from "@/view/MatchingDialog"
import { FeatureData } from "@/types/feature"

import type { AppProps } from "next/app"

type CapsuleContextType = {
  capsule: FeatureData
  setCapsule: React.Dispatch<React.SetStateAction<FeatureData>>
}

const initialCapsuleData: FeatureData = {
  geometry: {
    coordinates: [0, 0],
  },
  properties: {
    capsuleColor: "",
    gpsColor: "",
    emoji: "",
    openDate: "",
  },
}

export const CapsuleContext = React.createContext<CapsuleContextType>({
  capsule: initialCapsuleData,
  setCapsule: () => {},
})

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [capsule, setCapsule] = useState(initialCapsuleData)

  return (
    <SWRConfig>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
          colors: {
            brand: [
              "#f7fde6",
              "#edf9c1",
              "#e0f797",
              "#d3f36b",
              "#c9ef45",
              "#c1eb1e",
              "#b6d914",
              "#a7c202",
              "#98aa00",
              "#808300",
            ],
            secondary: [
              "#ecfbe8",
              "#cef4c5",
              "#aded9f",
              "#87e576",
              "#64de53",
              "#3bd72d",
              "#24c625",
              "#00b119",
              "#009d0b",
              "#007a00",
            ],
            gray: [
              "#fafafa",
              "#f6f6f6",
              "#eeeeed",
              "#e2e2e2",
              "#b0afaf",
              "#9e9e9d",
              "#757574",
              "#050404",
              "#424242",
              "#212121",
            ],
            dark: [
              "#C1C2C5",
              "#A6A7AB",
              "#909296",
              "#5C5F66",
              "#373A40",
              "#2C2E33",
              "#25262B",
              "#212121",
              "#141517",
              "#101113",
            ],
          },
          primaryColor: "brand",
        }}
      >
        <AuthProvider>
          <CapsuleContext.Provider value={{ capsule, setCapsule }}>
            <Loading>
              <MatchingDialog>
                <Component {...pageProps} />
              </MatchingDialog>
            </Loading>
          </CapsuleContext.Provider>
        </AuthProvider>
      </MantineProvider>
    </SWRConfig>
  )
}

export default MyApp
