import { useEffect } from "react"
import { Box, RingProgress, Stack, Text } from "@mantine/core"
import axios from "axios"
import ReactDOM from "react-dom"

import { loadCss } from "@/lib/loadCss"
import { loadScript } from "@/lib/loadScript"
import { MapBoxClick } from "@/types/mapBoxClick"

import Capsule from "./Capsule"

const Map: React.FC = () => {
  const userID = "user2"

  useEffect(() => {
    let mapquestSrc = "https://api.mapbox.com/mapbox-gl-js/v1.13.2/mapbox-gl.js"
    let mapboxSrc = "https://prodmqpstorage.z11.web.core.windows.net/mqplatform.js"
    let mapboxCssHref = "https://api.mapbox.com/mapbox-gl-js/v1.13.2/mapbox-gl.css"

    loadScript(mapquestSrc, () => {
      loadScript(mapboxSrc, mapSetUp)
    })

    loadCss(mapboxCssHref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mapSetUp = () => {
    // show map on Box
    // @ts-ignore
    const transformRequest = mqplatformTransformRequest(
      process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY,
    )
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
                // @ts-ignore
                res.data.features.forEach((feature) => {
                  const div = document.createElement("div")
                  ReactDOM.render(
                    <Capsule
                      capsuleColor="#d3f36b"
                      gpsColor="#212121"
                      emoji="😄"
                      size="sm"
                      bgSx={{
                        boxShadow: "0px 2.7200000286102295px 33.31999969482422px 0px #FFFFFF40",
                      }}
                    />,
                    div,
                  )
                  ReactDOM.render(
                    <RingProgress
                      size={120}
                      thickness={12}
                      sections={[
                        { value: 100 - (300 / 360) * 100, color: "gray.8" },
                        { value: (300 / 360) * 100, color: "#6888e8" },
                      ]}
                      label={
                        <Stack
                          sx={(theme) => ({
                            backgroundColor: theme.colors.gray[9],
                            width: 120 - 12 * 4,
                            height: 120 - 12 * 4,
                            borderRadius: "50%",
                            gap: 0,
                          })}
                        >
                          <Text
                            sx={{
                              fontSize: 10,
                              fontWeight: 300,
                              fontFamily: "Hiragino Sans",
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            残り
                          </Text>
                          <Text
                            sx={{
                              fontSize: 18,
                              fontWeight: 600,
                              fontFamily: "Hiragino Sans",
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            300日
                          </Text>
                        </Stack>
                      }
                    />,
                    div,
                  )

                  // @ts-ignore
                  new mapboxgl.Marker(div).setLngLat(feature.geometry.coordinates).addTo(map)
                })
              })
          }
        })
      })
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

  return <Box id="map" sx={{ width: "100%", height: "100vh" }} />
}

export default Map
