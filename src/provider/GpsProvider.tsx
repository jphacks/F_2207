import { createContext, useContext, useEffect, useState } from "react"

export type GpsType = {
  latitude: number
  longitude: number
}

const GpsContext = createContext<GpsType | null>(null)

export type GpsProviderProps = {
  children: React.ReactNode
}

const GpsProvider: React.FC<GpsProviderProps> = ({ children }) => {
  const [position, setPosition] = useState<GpsType | null>({ latitude: 0, longitude: 0 })

  useEffect(() => {
    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
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

  return <GpsContext.Provider value={position}>{children}</GpsContext.Provider>
}

export default GpsProvider

export const useGeolocation = () => {
  const context = useContext(GpsContext)
  if (context == null) {
    throw new Error()
  }
  return context
}
