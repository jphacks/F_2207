import { useEffect, useRef, useState } from "react"
import { Box, LoadingOverlay } from "@mantine/core"
import axios from "axios"
import { useRouter } from "next/router"
import Head from "next/head"
import { createRoot } from "react-dom/client"
import {
  Map,
  NavigationControl,
  GeolocateControl,
  Marker,
  Popup,
  MercatorCoordinate,
  LngLatLike,
} from "mapbox-gl"
import THREE, { Camera, Scene, DirectionalLight, WebGLRenderer, Matrix4, Vector3 } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

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

import "mapbox-gl/dist/mapbox-gl.css"

const MapPage: React.FC<MapPageProps> = ({ selectedCapsuleCenter }) => {
  const user = useUser()
  const userID = user?.id ?? ""

  const geolocation = useGeolocation()

  const router = useRouter()
  const [finishMapLoad, setFinishMapLoad] = useState(false)

  const mapRef = useRef<Map | null>(null)
  const mapInitialized = useRef(false)

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

    // parameters to ensure the model is georeferenced correctly on the map
    const modelOrigin = [135.6042317745411, 34.86210390210311] as const
    const modelAltitude = 0
    const modelRotate = [Math.PI / 2, 0, 0]

    const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude)

    // transformation parameters to position, rotate and scale the 3D model onto the map
    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      /* Since the 3D model is in real world meters, a scale transform needs to be
       * applied since the CustomLayerInterface expects units in MercatorCoordinates.
       */
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    }

    const camera = new Camera()
    const scene = new Scene()
    let renderer: THREE.WebGLRenderer | null = null

    // configuration of the custom layer for a 3D model per the CustomLayerInterface
    const customLayer: mapboxgl.AnyLayer = {
      id: "3d-model",
      type: "custom",
      renderingMode: "3d",
      onAdd: function (map, gl) {
        // create two three.js lights to illuminate the model
        const directionalLight = new DirectionalLight(0xffffff)
        directionalLight.position.set(0, -70, 100).normalize()
        scene.add(directionalLight)

        const directionalLight2 = new DirectionalLight(0xffffff)
        directionalLight2.position.set(0, 70, 100).normalize()
        scene.add(directionalLight2)

        // use the three.js GLTF loader to add the 3D model to the three.js scene
        const loader = new GLTFLoader()
        loader.load("/models/capsule3.glb", (gltf) => {
          scene.add(gltf.scene)
        })

        // use the Mapbox GL JS map canvas for three.js
        renderer = new WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
        })

        renderer!.autoClear = false
      },
      render: function (gl, matrix) {
        const rotationX = new Matrix4().makeRotationAxis(
          new Vector3(1, 0, 0),
          modelTransform.rotateX,
        )
        const rotationY = new Matrix4().makeRotationAxis(
          new Vector3(0, 1, 0),
          modelTransform.rotateY,
        )
        const rotationZ = new Matrix4().makeRotationAxis(
          new Vector3(0, 0, 1),
          modelTransform.rotateZ,
        )

        const m = new Matrix4().fromArray(matrix)
        const l = new Matrix4()
          .makeTranslation(
            modelTransform.translateX,
            modelTransform.translateY,
            modelTransform.translateZ as number,
          )
          .scale(
            new Vector3(
              modelTransform.scale * 0.5,
              -modelTransform.scale * 0.5,
              modelTransform.scale * 0.5,
            ),
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ)

        camera.projectionMatrix = m.multiply(l)
        renderer?.resetState()
        renderer?.render(scene, camera)
        map.triggerRepaint()
      },
    }

    map.on("style.load", () => {
      map.addLayer(customLayer, "EP9PAUebGrNL2Wb3idfvISMwyVt1")
    })

    map.on("load", (ev) => {
      setMarker(map, userID)
      console.log(map)

      // map.addSource("mapbox-dem", {
      //   type: "raster-dem",
      //   url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      //   tileSize: 512,
      //   maxzoom: 14,
      // })
      // add the DEM source as a terrain layer with exaggerated height
      // map.setTerrain({ source: "structurel-dem", exaggeration: 1.5 })

      // // add sky styling with `setFog` that will show when the map is highly pitched
      // map.setFog({
      //   "horizon-blend": 0.3,
      //   color: "#f8f0e3",
      //   "high-color": "#add8e6",
      //   "space-color": "#d8f2ff",
      //   "star-intensity": 0.0,
      // })
      const layers = map.getStyle().layers
      const labelLayerId = layers?.find(
        (layer) => layer.type === "symbol" && layer.layout?.["text-field"],
      )?.id

      if (labelLayerId == null) {
        return
      }

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      // map.addLayer(
      //   {
      //     id: "add-3d-buildings",
      //     source: "composite",
      //     "source-layer": "building",
      //     filter: ["==", "extrude", "true"],
      //     type: "fill-extrusion",
      //     minzoom: 15,
      //     paint: {
      //       "fill-extrusion-color": "#aaa",

      //       // Use an 'interpolate' expression to
      //       // add a smooth transition effect to
      //       // the buildings as the user zooms in.
      //       "fill-extrusion-height": [
      //         "interpolate",
      //         ["linear"],
      //         ["zoom"],
      //         15,
      //         0,
      //         15.05,
      //         ["get", "height"],
      //       ],
      //       "fill-extrusion-base": [
      //         "interpolate",
      //         ["linear"],
      //         ["zoom"],
      //         15,
      //         0,
      //         15.05,
      //         ["get", "min_height"],
      //       ],
      //       "fill-extrusion-opacity": 0.6,
      //     },
      //   },
      //   labelLayerId,
      // )
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
            console.log(layer)
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
    </>
  )
}

export default MapPage
