import { useEffect } from "react"
import Head from "next/head"
import { Box } from "@mantine/core"
import axios from "axios"

import { loadCss } from "@/lib/loadCss"
import { loadScript } from "@/lib/loadScript"

import type { NextPage } from "next"

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
    const layerID = "user2"
    map.setLayoutProperty(layerID, "visibility", "visible")

    // get mapquest layer id
    axios
      .get(
        "https://prod-mqplatform-api.azure-api.net/maps-api/layers/v1/18?subscription_key=63da4d3c414e4ae59b7af3d654fefaff",
      )
      .then((res) => {
        // @ts-ignore
        res.data.forEach((layer) => {
          if (layer.name == layerID) {
            // set Image
            axios
              .get(
                `https://prod-mqplatform-api.azure-api.net/maps-api/features/v1/18/${layer.id}?subscription_key=63da4d3c414e4ae59b7af3d654fefaff`,
              )
              .then((res) => {
                // @ts-ignore
                res.data.features.forEach((feature) => {
                  if (feature.properties.imageSrc && feature.properties.imageID) {
                    console.log(feature.properties.imageSrc)
                    map.loadImage(feature.properties.imageSrc, (error, image) => {
                      if (error) throw error
                      map.addImage(feature.properties.imageID, image!)
                    })
                  }
                })
              })
          }
        })
      })
  })

  map.on("click", "user2", (e) => {
    // @ts-ignore
    const coordinates = e.features[0].geometry.coordinates.slice()
    // @ts-ignore
    const description = e.features[0].properties.imageID

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
    }

    // @ts-ignore
    // 25 is half height of image
    new mapboxgl.Popup({ offset: 25 }).setLngLat(coordinates).setHTML(description).addTo(map)
  })

  map.on("mouseenter", "user2", () => {
    map.getCanvas().style.cursor = "pointer"
  })

  map.on("mouseleave", "user2", () => {
    map.getCanvas().style.cursor = ""
  })
}

const Map: NextPage = () => {
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

export default Map
