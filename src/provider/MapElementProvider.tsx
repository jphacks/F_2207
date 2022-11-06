import React, { createContext, useCallback, useContext, useMemo, useState } from "react"
import { Map, Marker } from "mapbox-gl"

type MapElementContextType = {
  element: HTMLCollection | null
  mapObj: Map | null
  markers: Marker[]
  addMarker: (marker: Marker) => void
  saveElement: (element: HTMLCollection, mapObj: Map) => void
  clearMarker: () => void
}

const MapElementContext = createContext<MapElementContextType | null>(null)

export type MapElementProviderProps = {
  children: React.ReactNode
}

const MapElementProvider: React.FC<MapElementProviderProps> = ({ children }) => {
  const [element, setElement] = useState<HTMLCollection | null>(null)
  const [mapObj, setMapObj] = useState<Map | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])

  const saveElement = useCallback((element: HTMLCollection, mapObj: Map) => {
    setElement(element)
    setMapObj(mapObj)
  }, [])

  const addMarker = useCallback((marker: Marker) => setMarkers((prev) => [...prev, marker]), [])

  const clearMarker = useCallback(() => setMarkers([]), [])

  const value = useMemo(
    () => ({ element, mapObj, markers, saveElement, addMarker, clearMarker }),
    [addMarker, element, mapObj, markers, saveElement, clearMarker],
  )

  return <MapElementContext.Provider value={value}>{children}</MapElementContext.Provider>
}

export default MapElementProvider

export const useMapElement = () => {
  const context = useContext(MapElementContext)
  if (context == null) {
    throw new Error()
  }
  return context
}
