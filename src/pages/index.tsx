import Head from "next/head"
import { Button } from "@mantine/core"

import type { NextPage } from "next"

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sample Next App</title>
        <meta name="description" content="sample next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4">
        <Box id="map" sx={{ width: "90%", height: "800px" }}></Box>
      </main>
    </>
  )
}

export default Index
