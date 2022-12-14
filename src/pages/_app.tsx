import "../styles/globals.css"
import { SWRConfig } from "swr"
import { MantineProvider } from "@mantine/core"
import dynamic from "next/dynamic"
import { Suspense, useEffect } from "react"

import { AuthProvider } from "@/auth/useAuth"
import Loading from "@/auth/Loading"
import GpsProvider from "@/provider/GpsProvider"
import { MatchingDialogProps } from "@/view/MatchingDialog"
import { theme } from "@/theme"
import MapElementProvider from "@/provider/MapElementProvider"

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
    // registerServiceWorker()
  }, [])

  return (
    <SWRConfig>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <AuthProvider>
          <GpsProvider>
            <MapElementProvider>
              <Inner>
                <Component {...pageProps} />
              </Inner>
            </MapElementProvider>
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
