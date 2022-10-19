import "../styles/globals.css"
import { SWRConfig } from "swr"
import { MantineProvider } from "@mantine/core"

import { AuthProvider } from "@/auth/useAuth"
import Loading from "@/auth/Loading"

import type { AppProps } from "next/app"

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <SWRConfig>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
        }}
      >
        <AuthProvider>
          <Loading>
            <Component {...pageProps} />
          </Loading>
        </AuthProvider>
      </MantineProvider>
    </SWRConfig>
  )
}

export default MyApp
