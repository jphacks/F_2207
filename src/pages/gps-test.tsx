import React, { useMemo } from "react"
import { Button } from "@mantine/core"
import { NextPage } from "next"

import { useOrientation } from "@/lib/useOrientation"
import { useGeolocation } from "@/lib/useGeolocation"
import { calcDistance } from "@/lib/calcDistance"

const GpsTest: NextPage = () => {
  const { orientation, requestPermission } = useOrientation()
  const geolocation = useGeolocation()

  const geo = useMemo(() => {
    if (geolocation == null) {
      return {
        distance: 0,
        bearing: 0,
        deviceBearing: 0,
      }
    }
    const { distance, bearing } = calcDistance(
      { latitude: geolocation.coords.latitude, longitude: geolocation.coords.longitude },
      {
        latitude: 34.86412770305309,
        longitude: 135.6051700426613,
      },
    )
    return {
      distance,
      bearing,
      deviceBearing: bearing - orientation.x,
    }
  }, [geolocation, orientation.x])

  return (
    <div className="p-8">
      <p className="text-[48px] font-bold tabular-nums">
        ({orientation.x.toFixed(2)}, <br /> {orientation.y.toFixed(2)})
      </p>
      <p className="text-[24px] font-bold tabular-nums">
        Distance: {geo.distance}, <br />
        Bearing: {geo.bearing}, <br />
        Device Beraing: {geo.deviceBearing}
      </p>
      <Button onClick={requestPermission}>grant permission</Button>
    </div>
  )
}

export default GpsTest
