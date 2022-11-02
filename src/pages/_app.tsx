import "../styles/globals.css"
import { SWRConfig } from "swr"
import { MantineProvider } from "@mantine/core"
import dynamic from "next/dynamic"
import { Suspense, useEffect } from "react"

import { AuthProvider } from "@/auth/useAuth"
import Loading from "@/auth/Loading"
import GpsProvider from "@/provider/GpsProvider"
import { MatchingDialogProps } from "@/view/MatchingDialog"

import type { AppProps } from "next/app"

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      })
      if (registration.installing) {
        console.log("Service worker installing")
      } else if (registration.waiting) {
        console.log("Service worker installed")
      } else if (registration.active) {
        console.log("Service worker active")
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`)
    }
  }
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    registerServiceWorker()
  }, [])

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
          <GpsProvider>
            <Inner>
              <Component {...pageProps} />
            </Inner>
          </GpsProvider>
        </AuthProvider>
      </MantineProvider>
    </SWRConfig>
  )
}

export default MyApp

const MatchingDialog = dynamic<MatchingDialogProps>(() => import("@/view/MatchingDialog"), {
  suspense: true,
})

export const Inner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Loading>
      <Suspense fallback={children}>
        <MatchingDialog>{children}</MatchingDialog>
      </Suspense>
    </Loading>
  )
}
