import { useEffect, useState } from "react"

export const useGeolocation = () => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)

  useEffect(() => {
    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        setPosition(position)
      },
      (e) => {
        console.log(e)
        window.alert("位置情報の取得に失敗しました")
      },
      {
        enableHighAccuracy: true,
      },
    )

    return () => navigator.geolocation.clearWatch(watchID)
  }, [])

  return position
}
