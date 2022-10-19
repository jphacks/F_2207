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
          },
          primaryColor: "brand",
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
