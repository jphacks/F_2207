/* eslint-disable unused-imports/no-unused-imports */
import { NextPage } from "next"
import { MutableRefObject, Suspense, useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, ThreeElements, useLoader } from "@react-three/fiber"
import THREE, { Color, MeshBasicMaterial } from "three"
import Webcam from "react-webcam"
import { Button } from "@mantine/core"
import { useGLTF } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import { useGeolocation } from "@/lib/useGeolocation"
import { useOrientation } from "@/lib/useOrientation"
import { useSyncCamera } from "@/lib/threejs/useSyncCamera"
import { calcDistance } from "@/lib/calcDistance"

const Box: React.FC<ThreeElements["mesh"] & { color: string }> = ({ color, ...props }) => {
  const ref = useRef<THREE.Mesh | null>(null)
  const { nodes, scene, materials } = useLoader(GLTFLoader, "/models/capsule3.glb")

  useFrame(() => {
    if (ref.current == null) {
      return
    }
    ref.current.rotation.z += 0.00075
    ref.current.rotation.y += 0.0005
  })

  const basicMaterial = new MeshBasicMaterial({ color: new Color("#520B3E") })

  return (
    <Suspense fallback={null}>
      <mesh material={basicMaterial}>
        <primitive ref={ref} object={scene} {...props} scale={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#DD0000" opacity={0.5} />
      </mesh>
    </Suspense>
  )
}

const Cylinder: React.FC<ThreeElements["mesh"] & { color: string }> = ({ color, ...props }) => {
  const ref = useRef<THREE.Mesh | null>(null)

  useFrame(() => {
    if (ref.current == null) {
      return
    }
    ref.current.rotation.x = 0
    ref.current.rotation.y += 0.01
    ref.current.rotation.z = 0
  })

  return (
    <mesh {...props} ref={ref}>
      <cylinderGeometry args={[0.5, 0, 1, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const ArCanvas: React.FC<{
  orientation: MutableRefObject<{ x: number; y: number }>
  boxPosition: { x: number; y: number; z: number }
}> = ({ orientation, boxPosition }) => {
  useSyncCamera(orientation, { x: 0, y: 2, z: 0 })

  return (
    <>
      <Box
        position={[boxPosition.x, boxPosition.y, boxPosition.z]}
        scale={[10, 10, 10]}
        color="orange"
      />
      <Cylinder
        position={[boxPosition.x, boxPosition.y + 30, boxPosition.z]}
        scale={[10, 10, 10]}
        color="orange"
      />
      {Array(10)
        .fill(null)
        .map((_, i) => (
          <Box
            key={i}
            position={[
              Math.sin((i * Math.PI * 2) / 10) * 20,
              0,
              Math.cos((i * Math.PI * 2) / 10) * 20,
            ]}
            scale={[1, 1, 1]}
            color={`hsl(${36 * i}, 50%, 50%)`}
          />
        ))}
      <ambientLight />
      <gridHelper args={[20]} />
      <arrowHelper />
      <pointLight position={[1, 1, 1]} />
    </>
  )
}

const ArPage: NextPage = () => {
  const { orientation, orientationRef, requestPermission } = useOrientation()
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
      deviceBearing: orientation.x - bearing,
    }
  }, [geolocation, orientation.x])

  const boxPosition = useMemo(() => {
    const degree = 90 - geo.bearing
    return {
      x: -geo.distance * Math.cos(degree * (Math.PI / 180)),
      y: 0,
      z: geo.distance * Math.sin(degree * (Math.PI / 180)),
    }
  }, [geo.bearing, geo.distance])

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
      <div className="fixed inset-0 p-8 text-white" style={{ textShadow: "2px 2px 2px #000000" }}>
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
    </>
  )
}

export default ArPage
