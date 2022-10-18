import { useEffect, useState } from "react"

export const useGeolocation = () => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(console.log)
    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        setPosition(position)
      },
      () => {},
      {
        enableHighAccuracy: true,
      },
    )

    return () => navigator.geolocation.clearWatch(watchID)
  }, [])

  return position
}
