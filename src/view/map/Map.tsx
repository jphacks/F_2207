import { useEffect } from "react"
import { Box } from "@mantine/core"
import axios from "axios"
import ReactDOM from "react-dom"

import { loadCss } from "@/lib/loadCss"
import { loadScript } from "@/lib/loadScript"
import { MapBoxClick } from "@/types/mapBoxClick"
import { Feature } from "@/types/feature"
import { useUser } from "@/auth/useAuth"

import LockedCapsule from "./LockedCapsule"
import MapCapsule from "./MapCapsule"

const Map: React.FC = () => {
  const user = useUser()
  const userID = user?.id ?? ""
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
                    ReactDOM.render(<MapCapsule feature={feature} />, div)
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

  return <Box id="map" sx={{ width: "100%", height: "calc(100vh - 72px)" }} />
}

export default Map
