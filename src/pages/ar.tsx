import { NextPage } from "next"
import { MutableRefObject, useMemo, useRef } from "react"
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber"
import THREE from "three"
import Webcam from "react-webcam"

import { useGeolocation } from "@/lib/useGeolocation"
import { useOrientation } from "@/lib/useOrientation"
import { useSyncCamera } from "@/lib/threejs/useSyncCamera"
import { calcDistance } from "@/lib/calcDistance"

const Box: React.FC<ThreeElements["mesh"]> = ({ ...props }) => {
  const ref = useRef<THREE.Mesh | null>(null)

  useFrame(() => {
    if (ref.current == null) {
      return
    }
    ref.current.rotation.x += 0.01
  })

  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

const ArCanvas: React.FC<{
  orientation: MutableRefObject<{ x: number; y: number }>
  boxPosition: { x: number; y: number; z: number }
}> = ({ orientation, boxPosition }) => {
  useSyncCamera(orientation, { x: 0, y: 0, z: 0 })

  return (
    <>
      <Box position={[boxPosition.x, boxPosition.y, boxPosition.z]} scale={[10, 10, 10]} />
      <ambientLight />
      <gridHelper />
      <arrowHelper />
      <pointLight position={[1, 1, 1]} />
    </>
  )
}

const ArPage: NextPage = () => {
  const geolocation = useGeolocation()
  const { orientation, orientationRef, requestPermission } = useOrientation()

  const distanceAndBearing = useMemo(() => {
    if (geolocation?.coords == null) {
      return
    }
    return calcDistance(
      {
        latitude: geolocation.coords.latitude,
        longitude: geolocation.coords.longitude,
      },
      {
        latitude: 34.864448357843344,
        longitude: 135.60541331417622,
      },
    )
  }, [geolocation?.coords])

  const boxPosition = useMemo(() => {
    if (distanceAndBearing == null) {
      return { x: -10, y: 0, z: 0 }
    }
    return {
      x: distanceAndBearing.distance * Math.cos(distanceAndBearing.bearing - 90),
      // y: distanceAndBearing.distance * 0.1,
      y: 0,
      z: distanceAndBearing.distance * Math.sin(distanceAndBearing.bearing - 90),
    }
  }, [distanceAndBearing])

  const distance = 1
  const a = distance * Math.cos(orientation.x * (Math.PI / 180))
  const b =
    -distance *
    Math.sin(orientation.x * (Math.PI / 180)) *
    Math.sin((orientation.y - 90) * (Math.PI / 180))
  const c =
    -distance *
    Math.sin(orientation.x * (Math.PI / 180)) *
    Math.cos((orientation.y - 90) * (Math.PI / 180))

  return (
    <>
      <Webcam
        videoConstraints={{
          facingMode: { exact: "environment" },
        }}
      />
      <div className="fixed inset-0">
        <Canvas>
          <ArCanvas orientation={orientationRef} boxPosition={boxPosition} />
        </Canvas>
      </div>
      <div className="fixed inset-x-0 bottom-0 m-4 rounded bg-white/50 p-4 text-white backdrop-blur">
        <div>
          <div>
            ({geolocation?.coords.latitude}, {geolocation?.coords.longitude},{" "}
            {geolocation?.coords.altitude})
          </div>
          <div>{geolocation != null && new Date(geolocation?.timestamp).toLocaleString()}</div>
        </div>
        <div>
          ({orientation.x.toFixed(2)}, {orientation.y.toFixed(2)})
        </div>
        <div>
          ({a.toFixed(2)}, {b.toFixed(2)}, {c.toFixed(2)})
        </div>
        <div>
          boxLocation: ({boxPosition?.x.toFixed(2)}, {boxPosition?.y.toFixed(2)},{" "}
          {boxPosition?.z.toFixed(2)})
        </div>
        <button onClick={requestPermission}>Device Orientation</button>
      </div>
    </>
  )
}

export default ArPage
