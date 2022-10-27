import { useEffect, useState } from "react"
import { Box, LoadingOverlay } from "@mantine/core"
import axios from "axios"
import { useRouter } from "next/router"
import Head from "next/head"
import ReactDOM from "react-dom"

import { MapBoxClick } from "@/types/mapBoxClick"
import { Feature } from "@/types/feature"
import { useUser } from "@/auth/useAuth"
import mqplatformTransformRequest from "@/lib/mqplatformTransformRequest"

import MapCapsule from "./MapCapsule"
import LockedCapsule from "./LockedCapsule"

const Map: React.FC = () => {
  const user = useUser()
  const userID = user?.id ?? ""

  const router = useRouter()
  const [finishMapLoad, setFinishMapLoad] = useState(false)

  const mapSetUp = () => {
    // show map on Box
    const transformRequest = mqplatformTransformRequest(
      process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY,
      userID,
    )
    // @ts-ignore
    var map = new mapboxgl.Map({
      container: "map",
      style: "mqplatform://maps-api/styles/v1/18",
      transformRequest: transformRequest,
      logoPosition: "top-left",
    })
    // @ts-ignore
    // zoom control
    map.addControl(new mapboxgl.NavigationControl(), "bottom-left")
    // current place control
    map.addControl(
      // @ts-ignore
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserLocation: true,
        showUserHeading: true,
      }),
      "bottom-left",
    )

    map.once("data", () => {
      setCenterToCurrentPlace(map)
    })

    map.on("load", () => {
      setMarker(map, userID)
    })

    map.on("click", userID, (e) => {
      onClickCapsule(map, e)
    })

    map.on("mouseenter", userID, () => {
      map.getCanvas().style.cursor = "pointer"
    })

    map.on("mouseleave", userID, () => {
      map.getCanvas().style.cursor = ""
    })
  }

  // set image to mapbox
  const setMarker = (map: mapboxgl.Map, userID: string) => {
    // get mapquest layer id
    axios
      .get(
        `https://prod-mqplatform-api.azure-api.net/maps-api/layers/v1/18?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
      )
      .then((res) => {
        // @ts-ignore
        res.data.forEach((layer) => {
          if (layer.name == userID) {
            // set Image
            axios
              .get(
                `https://prod-mqplatform-api.azure-api.net/maps-api/features/v1/18/${layer.id}?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
              )
              .then((res) => {
                res.data.features.forEach((feature: Feature) => {
                  const div = document.createElement("div")
                  const today = Date.now()
                  const openDate = Date.parse(feature.properties.openDate)

                  if (today > openDate) {
                    ReactDOM.render(
                      <MapCapsule
                        feature={feature}
                        onClick={() => router.push(`/cupsel/open/${feature.properties.id}`)}
                      />,
                      div,
                    )
                  } else {
                    ReactDOM.render(<LockedCapsule feature={feature} />, div)
                  }

                  // @ts-ignore
                  new mapboxgl.Marker(div).setLngLat(feature.geometry.coordinates).addTo(map)
                })
              })
          }
        })
      })
      .finally(() => setFinishMapLoad(true))
  }

  const setCenterToCurrentPlace = (map: mapboxgl.Map) => {
    // get current position
    navigator.geolocation.getCurrentPosition((position) => {
      // set current place to center
      const { latitude, longitude } = position.coords
      map.setCenter([longitude, latitude])
      map.setZoom(15)
    })
  }

  const onClickCapsule = (map: mapboxgl.Map, e: MapBoxClick) => {
    if (
      e.features == undefined ||
      e.features[0].properties == null ||
      e.features[0].geometry.type != "Point"
    ) {
      return
    }
    const coordinates = e.features[0].geometry.coordinates.slice()
    const description: string = e.features[0].properties.imageID

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
    }

    // @ts-ignore
    // 25 is half height of image
    new mapboxgl.Popup({ offset: 25 }).setLngLat(coordinates).setHTML(description).addTo(map)
  }

  useEffect(() => {
    mapSetUp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          rel="prefetch"
          href={`https://prod-mqplatform-api.azure-api.net/maps-api/layers/v1/18?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`}
        />
        <link
          rel="stylesheet prefetch"
          href="https://api.mapbox.com/mapbox-gl-js/v1.13.2/mapbox-gl.css"
        />
      </Head>
      {/* <Button
        onClick={() => {
          console.log(markers)
          markers.forEach((res) => {
            res.data.features.forEach((feature: Feature) => {
              const div = document.createElement("div")
              const today = Date.now()
              const openDate = Date.parse(feature.properties.openDate)

              const root = createRoot(div)

              // @ts-ignore
              new mapboxgl.Marker(div).setLngLat(feature.geometry.coordinates).addTo(mapRef.current)

              if (today > openDate) {
                root.render(
                  <MapCapsule
                    feature={feature}
                    onClick={() => router.push(`/cupsel/open/${feature.properties.id}`)}
                  />,
                )
              } else {
                root.render(<LockedCapsule feature={feature} />)
              }
            })
          })
        }}
      >
        add
      </Button> */}
      <Box id="map" sx={{ width: "100%", height: "calc(100vh - 72px)" }}>
        <LoadingOverlay
          visible={!finishMapLoad}
          loaderProps={{ size: "xl" }}
          overlayOpacity={0.6}
        />
      </Box>
    </>
  )
}

export default Map
