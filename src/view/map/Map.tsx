import { useEffect, useRef, useState } from "react"
import { Box, LoadingOverlay } from "@mantine/core"
import axios from "axios"
import { useRouter } from "next/router"
import Head from "next/head"
import { createRoot } from "react-dom/client"
import { Map, NavigationControl, GeolocateControl, Marker, Popup, LngLatLike } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import { MapBoxClick } from "@/types/mapBoxClick"
import { Feature } from "@/types/feature"
import { useUser } from "@/auth/useAuth"
import mqplatformTransformRequest from "@/lib/mqplatformTransformRequest"
import { GpsType, useGeolocation } from "@/provider/GpsProvider"
import { useMapElement } from "@/provider/MapElementProvider"
import { featureSortFunc } from "@/lib/sortCapsule"

import MapCapsule from "./MapCapsule"
import LockedCapsule from "./LockedCapsule"

export type MapPageProps = {
  selectedCapsuleCenter: LngLatLike | null
}

const MapPage: React.FC<MapPageProps> = ({ selectedCapsuleCenter }) => {
  const user = useUser()
  const userID = user?.id ?? ""

  const geolocation = useGeolocation()

  const router = useRouter()
  const [finishMapLoad, setFinishMapLoad] = useState(false)

  const mapRef = useRef<Map | null>(null)

  const {
    element: mapElement,
    markers,
    mapObj,
    saveElement: saveMapElement,
    addMarker,
    clearMarker,
  } = useMapElement()

  const mapSetUp = async () => {
    if (mapRef.current != null) {
      return
    }

    const currentPosition =
      geolocation.latitude !== 0
        ? geolocation
        : await new Promise<GpsType>((resolve) =>
            navigator.geolocation.getCurrentPosition((position) => resolve(position.coords)),
          )

    // show map on Box
    const transformRequest = mqplatformTransformRequest(
      process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY,
      userID,
    )
    const map = new Map({
      container: "map",
      style: "mqplatform://maps-api/styles/v1/18",
      transformRequest,
      logoPosition: "top-left",
      center: {
        lat: currentPosition.latitude,
        lng: currentPosition.longitude,
      },
      zoom: 15,
    })
    mapRef.current = map

    // zoom control
    map.addControl(new NavigationControl(), "bottom-left")
    // current place control
    map.addControl(
      new GeolocateControl({
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
        markers.forEach((marker) => marker.remove())
        clearMarker()
        res.data.forEach((layer: any) => {
          if (layer.name == userID) {
            // set Image
            axios
              .get(
                `https://prod-mqplatform-api.azure-api.net/maps-api/features/v1/18/${layer.id}?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`,
              )
              .then((res) => {
                const sortedFeatures = res.data.features.sort(featureSortFunc)
                sortedFeatures.forEach((feature: Feature) => {
                  const div = document.createElement("div")
                  const root = createRoot(div)

                  const today = Date.now()
                  const openDate = Date.parse(feature.properties.openDate)

                  if (today > openDate) {
                    root.render(
                      <MapCapsule
                        feature={feature}
                        onClick={() => router.push(`/capsule/open/${feature.properties.id}`)}
                      />,
                    )
                  } else {
                    root.render(<LockedCapsule feature={feature} />)
                  }

                  const marker = new Marker(div)
                    .setLngLat(feature.geometry.coordinates as [number, number])
                    .addTo(map)
                  addMarker(marker)
                })
              })
          }
        })
      })
      .finally(() => {
        setFinishMapLoad(true)
        const mapElement = document.getElementById("map")
        if (mapElement != null) {
          saveMapElement(mapElement as HTMLDivElement, map)
        }
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

    // 25 is half height of image
    new Popup({ offset: 25 })
      .setLngLat(coordinates as [number, number])
      .setHTML(description)
      .addTo(map)
  }

  useEffect(() => {
    if (mapElement == null) {
      mapSetUp()
    } else {
      const container = document.getElementById("map")
      container?.appendChild?.(mapElement)
      if (mapObj != null && user != null) {
        setMarker(mapObj, user.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (map == null || selectedCapsuleCenter == null) {
      return
    }
    map.flyTo({
      center: selectedCapsuleCenter,
      duration: 800,
    })
  }, [selectedCapsuleCenter])

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={`https://prod-mqplatform-api.azure-api.net/maps-api/layers/v1/18?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`}
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect dns-prefetch"
          href="https://cyberjapandata.gsi.go.jp"
          crossOrigin="anonymous"
        />
      </Head>
      <Box
        id="map"
        className="h-map-screen" //h-[calc(100vh-72px)]
        sx={{ width: "100%" /*height: "calc(100vh - 72px)"*/ }}
      >
        <LoadingOverlay
          visible={!finishMapLoad}
          loaderProps={{ size: "xl" }}
          overlayOpacity={0.6}
        />
      </Box>
    </>
  )
}

export default MapPage
