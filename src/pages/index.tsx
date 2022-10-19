import { useEffect } from "react"
import Head from "next/head"
import { Box } from "@mantine/core"

import type { NextPage } from "next"

const loadScript = (url: string, onload: () => void) => {
  const head = document.getElementsByTagName("head")[0] as HTMLElement
  const script = document.createElement("script")
  script.type = "text/javascript"
  script.src = url
  script.addEventListener("load", onload)

  head.appendChild(script)
}

const loadCss = (url: string) => {
  const head = document.getElementsByTagName("head")[0] as HTMLElement
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = url

  head.appendChild(link)
}

const mapSetUp = () => {
  // show map on Box
  // @ts-ignore
  const transformRequest = mqplatformTransformRequest("63da4d3c414e4ae59b7af3d654fefaff")
  // @ts-ignore
  var map = new mapboxgl.Map({
    container: "map",
    style: "mqplatform://maps-api/styles/v1/18",
    transformRequest: transformRequest,
  })
  // @ts-ignore
  // zoom control
  map.addControl(new mapboxgl.NavigationControl())
  // current place control
  map.addControl(
    // @ts-ignore
    new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true,
    }),
  )

  map.once("data", () => {
    // get current position
    navigator.geolocation.getCurrentPosition((position) => {
      // set current place to center
      const { latitude, longitude } = position.coords
      // @ts-ignore
      map.setCenter([longitude, latitude])
      map.setZoom(15)
    })
  })

  map.on("load", () => {
    // show user's layer
    // it shows only on UI(not set property in mapquest)
    const layerID = "user1"
    map.setLayoutProperty(layerID, "visibility", "visible")
  })
}

const Index: NextPage = () => {
  useEffect(() => {
    let mapquestSrc = "https://api.mapbox.com/mapbox-gl-js/v1.13.2/mapbox-gl.js"
    let mapboxSrc = "https://prodmqpstorage.z11.web.core.windows.net/mqplatform.js"
    let mapboxCssHref = "https://api.mapbox.com/mapbox-gl-js/v1.13.2/mapbox-gl.css"

    loadScript(mapquestSrc, () => {
      loadScript(mapboxSrc, mapSetUp)
    })

    loadCss(mapboxCssHref)
  }, [])

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
