import { createContext, useContext, useEffect, useState } from "react"

import { useAuth } from "@/auth/useAuth"

export type GpsType = {
  latitude: number
  longitude: number
}

const GpsContext = createContext<GpsType | null>(null)

export type GpsProviderProps = {
  children: React.ReactNode
}

const GpsProvider: React.FC<GpsProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [position, setPosition] = useState<GpsType | null>({ latitude: 0, longitude: 0 })

  useEffect(() => {
    if (user == null) {
      return
    }
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
  }, [user])

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
