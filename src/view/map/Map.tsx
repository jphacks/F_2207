import { useEffect, useRef, useState } from "react"
import { Box, Button, LoadingOverlay, Modal } from "@mantine/core"
import axios from "axios"
import { useRouter } from "next/router"
import Head from "next/head"
import { Map, NavigationControl, GeolocateControl, Popup, LngLatLike } from "mapbox-gl"
import { PerspectiveCamera, Raycaster, Scene, Vector2, Vector3 } from "three"

import { MapBoxClick } from "@/types/mapBoxClick"
import { useUser } from "@/auth/useAuth"
import mqplatformTransformRequest from "@/lib/mqplatformTransformRequest"
import { GpsType, useGeolocation } from "@/provider/GpsProvider"
import { useMapElement } from "@/provider/MapElementProvider"
import { featureSortFunc } from "@/lib/sortCapsule"
import { show3dOnMap } from "@/lib/show3dOnMap"

import "mapbox-gl/dist/mapbox-gl.css"

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
  const mapInitialized = useRef(false)

  const [open, setOpen] = useState(false)
  const [searchTargetId, setSearchTargetId] = useState("")

  const camera = new PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 1e6)
  const scene = new Scene()

  const {
    element: mapElement,
    markers,
    mapObj,
    saveElement: saveMapElement,
    addMarker,
    clearMarker,
  } = useMapElement()

  const mapSetUp = async () => {
    if (mapRef.current != null || mapInitialized.current) {
      return
    }

    mapInitialized.current = true

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
      zoom: 17,
      bearing: -12,
      pitch: 60,
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

    map.on("click", (e) => {
      const raycaster = new Raycaster()
      var mouse = new Vector2()
      // // scale mouse pixel position to a percentage of the screen's width and height
      mouse.x = (e.point.x / map.transform.width) * 2 - 1
      mouse.y = 1 - (e.point.y / map.transform.height) * 2
      const camInverseProjection = camera.projectionMatrix.invert()
      const cameraPosition = new Vector3().applyMatrix4(camInverseProjection)
      const mousePosition = new Vector3(mouse.x, mouse.y, 1).applyMatrix4(camInverseProjection)
      const viewDirection = mousePosition.clone().sub(cameraPosition).normalize()
      raycaster.set(cameraPosition, viewDirection)
      // calculate objects intersecting the picking ray
      var intersects = raycaster
        .intersectObjects(scene.children, true)
        .filter((i) => i.object.name == "本体")
      if (intersects.length) {
        const intersect = intersects[0]
        setOpen(true)
        setSearchTargetId(intersect.object.parent!.parent!.parent!.name)
      }
    })

    map.on("style.load", () => {
      // setMarker(map, userID)
    })

    map.on("load", (ev) => {
      setMarker(map, userID)
      console.log(map)

      const layers = map.getStyle().layers
      const labelLayerId = layers?.find(
        (layer) => layer.type === "symbol" && layer.layout?.["text-field"],
      )?.id

      if (labelLayerId == null) {
        return
      }
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
                const customLayer = show3dOnMap(sortedFeatures, "features", map, camera, scene)
                map.addLayer(customLayer, layer.name)
                // sortedFeatures.forEach((feature: Feature) => {
                //   const camera = new PerspectiveCamera(
                //     28,
                //     window.innerWidth / window.innerHeight,
                //     0.1,
                //     1e6,
                //   )
                //   const scene = new Scene()

                //   const featureOrigin = [
                //     feature.geometry.coordinates[0],
                //     feature.geometry.coordinates[1],
                //   ] as [number, number]
                //   const customLayer = show3dOnMap(
                //     featureOrigin,
                //     "feature-" + feature.id,
                //     map,
                //     camera,
                //     scene,
                //   )
                //   map.addLayer(customLayer, layer.name)

                // const div = document.createElement("div")
                // const root = createRoot(div)

                // const today = Date.now()
                // const openDate = Date.parse(feature.properties.openDate)

                // if (today > openDate) {
                //   root.render(
                //     <MapCapsule
                //       feature={feature}
                //       onClick={() => router.push(`/capsule/open/${feature.properties.id}`)}
                //     />,
                //   )
                // } else {
                //   root.render(<LockedCapsule feature={feature} />)
                // }

                // const marker = new Marker(div)
                //   .setLngLat(feature.geometry.coordinates as [number, number])
                //   .addTo(map)
                // addMarker(marker)
                // })
              })
          }
        })
      })
      .finally(() => {
        setFinishMapLoad(true)
        const mapElement = document.getElementById("map")

        if (mapElement?.children != null) {
          saveMapElement(mapElement.children, map)
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
      for (let i = 0; i < mapElement.length; i++) {
        container?.appendChild?.(mapElement.item(i))
      }
      // container?.appendChild?.(mapElement)
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
          rel="preload"
          href={`https://prod-mqplatform-api.azure-api.net/maps-api/styles/v1/18?subscription_key=${process.env.NEXT_PUBLIC_MAP_SUBSCRIPTION_KEY}`}
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
        className="mapboxgl-map h-map-screen" //h-[calc(100vh-72px)]
        sx={{ width: "100%" /*height: "calc(100vh - 72px)"*/ }}
      >
        <LoadingOverlay
          visible={!finishMapLoad}
          loaderProps={{ size: "xl" }}
          overlayOpacity={0.6}
        />
      </Box>
      <Modal
        centered
        opened={open}
        onClose={() => setOpen(false)}
        withCloseButton={false}
        styles={{
          modal: {
            background: "#212121",
            color: "white",
          },
        }}
      >
        <div className="flex flex-col items-center">
          <div>このカプセルを探しに行きますか？</div>
          <Button
            className="mt-4 bg-[#d3f36b] text-black hover:bg-[#c8e762]"
            onClick={() => {
              setOpen(false)
              router.push(`/capsule/open/${searchTargetId}`)
            }}
          >
            探しに行く
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default MapPage
