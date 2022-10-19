import { useEffect } from "react"
import { Box } from "@mantine/core"
import axios from "axios"

import { loadCss } from "@/lib/loadCss"
import { loadScript } from "@/lib/loadScript"
import { mapBoxClick } from "@/types/mapBoxClick"

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
      setCenterToCurrentPlace(map)
    })

    map.on("load", () => {
      showLayer(map, userID)
      setImage(map, userID)
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

  // show user's layer
  // it shows only on UI(not set property in mapquest)
  const showLayer = (map: mapboxgl.Map, userID: string) => {
    const layerID = userID
    map.setLayoutProperty(layerID, "visibility", "visible")
  }

  // set image to mapbox
  const setImage = (map: mapboxgl.Map, userID: string) => {
    // get mapquest layer id
    axios
      .get(
        "https://prod-mqplatform-api.azure-api.net/maps-api/layers/v1/18?subscription_key=63da4d3c414e4ae59b7af3d654fefaff",
      )
      .then((res) => {
        // @ts-ignore
        res.data.forEach((layer) => {
          if (layer.name == userID) {
            // set Image
            axios
              .get(
                `https://prod-mqplatform-api.azure-api.net/maps-api/features/v1/18/${layer.id}?subscription_key=63da4d3c414e4ae59b7af3d654fefaff`,
              )
              .then((res) => {
                // @ts-ignore
                res.data.features.forEach((feature) => {
                  if (feature.properties.imageSrc && feature.properties.imageID) {
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

  const onClickCapsule = (map: mapboxgl.Map, e: mapBoxClick) => {
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

  return <Box id="map" sx={{ width: "90%", height: "800px" }} />
}

export default Map
