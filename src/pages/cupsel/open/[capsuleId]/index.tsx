import { NextPage } from "next"
import { MutableRefObject, Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, ThreeElements, useLoader } from "@react-three/fiber"
import THREE, { Color, MeshBasicMaterial } from "three"
import Webcam from "react-webcam"
import { Button, Loader, Modal } from "@mantine/core"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Html } from "@react-three/drei"
import { Text } from "@mantine/core"
import { useRouter } from "next/router"

import { useGeolocation } from "@/provider/GpsProvider"
import { useOrientation } from "@/lib/useOrientation"
import { useSyncCamera } from "@/lib/threejs/useSyncCamera"
import { calcDistance } from "@/lib/calcDistance"
import CapsuleDistance from "@/view/ar/CapsuleDistance"
import { useCapsule } from "@/hooks/useCapsule"
import { Capsule } from "@/types/capsule"
import DiscoverDrawer from "@/view/DiscoverDrawer"

const CapsuleModel: React.FC<ThreeElements["mesh"] & { color: string; distance: number }> = ({
  color,
  distance,
  ...props
}) => {
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
      <group>
        <mesh material={basicMaterial}>
          <primitive ref={ref} object={scene} {...props} scale={[0.075, 0.075, 0.075]} />
          <Html
            className="text-2xl text-red-400"
            center
            distanceFactor={10}
            // @ts-ignore
            position={[props.position[0], props.position[1] + 15, props.position[2]]}
          >
            <CapsuleDistance className="scale-[10]" capsuleColor={color} distance={distance} />
          </Html>
        </mesh>
      </group>
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
  distance: number
  color: string
}> = ({ orientation, boxPosition, distance, color }) => {
  useSyncCamera(orientation, { x: 0, y: 10, z: 0 })

  return (
    <>
      <CapsuleModel
        position={[boxPosition.x, boxPosition.y, boxPosition.z]}
        scale={[10, 10, 10]}
        color={color}
        distance={distance}
      />
      <Cylinder
        position={[boxPosition.x, boxPosition.y + 50, boxPosition.z]}
        scale={[10, 10, 10]}
        color="#d8cb52"
      />
      <ambientLight />
      <gridHelper args={[20]} />
      <arrowHelper />
      <pointLight position={[1, 1, 1]} />
    </>
  )
}

const ArPage: React.FC<{ capsule: Capsule }> = ({ capsule }) => {
  const router = useRouter()
  const isDebugMode = router.query.debug === "true"

  const { orientation, orientationRef, requestPermission, isReady } = useOrientation()
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
      { latitude: geolocation.latitude, longitude: geolocation.longitude },
      {
        latitude: capsule.latitude + 0.0002,
        longitude: capsule.longitude,
      },
    )
    return {
      distance,
      bearing,
      deviceBearing: orientation.x - bearing,
    }
  }, [capsule.latitude, capsule.longitude, geolocation, orientation.x])

  const boxPosition = useMemo(() => {
    const degree = 90 - geo.bearing
    return {
      x: -geo.distance * Math.cos(degree * (Math.PI / 180)),
      y: 1,
      z: geo.distance * Math.sin(degree * (Math.PI / 180)),
    }
  }, [geo.bearing, geo.distance])

  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (geo.distance < 10) {
      setOpen(true)
    }
  }, [geo.distance])

  return (
    <>
      <div className="relative">
        <Webcam
          videoConstraints={{
            facingMode: { exact: "environment" },
          }}
        />
        {geolocation != null && (
          <div className="absolute left-6 bottom-6 flex">
            <Text
              sx={{
                display: "block",
                fontSize: 24,
                lineHeight: 1,
                textAlign: "center",
                fontFamily: "nagoda",
                color: "white",
                textShadow: "0px 0px 3px #0000009f",
                whiteSpace: "pre-wrap",
              }}
            >
              <span className="text-sm">YOU</span>
              <br />
              {convertLongLat(geolocation.longitude, "lng") +
                "\n" +
                convertLongLat(geolocation.latitude, "lat")}
            </Text>
          </div>
        )}
      </div>
      <div className="fixed inset-0">
        <Canvas>
          <ArCanvas
            orientation={orientationRef}
            boxPosition={boxPosition}
            distance={geo.distance}
            color={capsule.color}
          />
        </Canvas>
      </div>
      <Modal centered opened={!isReady} onClose={requestPermission} withCloseButton={false}>
        <div className="flex flex-col items-center">
          <p>デバイスの姿勢情報にアクセスします</p>
          <Button onClick={requestPermission}>OK</Button>
        </div>
      </Modal>
      {isDebugMode && (
        <div className="fixed inset-0 p-8 text-white" style={{ textShadow: "0px 0px 3px #000000" }}>
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
      )}
      <DiscoverDrawer
        onOpenCapsule={() => router.push(`/cupsel/open/${capsule.id}/shake`)}
        capsule={capsule}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

const CapsulePage: NextPage = () => {
  const router = useRouter()
  const capsuleId = router.query.capsuleId as string
  const capsule = useCapsule(capsuleId)

  if (capsule == null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader aria-label="ロード中" />
      </div>
    )
  } else {
    return <ArPage capsule={capsule} />
  }
}

export default CapsulePage

const convertLongLat = (num: number, type: "lng" | "lat") => {
  const degree = Math.floor(num)
  const minute = Math.floor((num - degree) * 60)
  const second = ((num - degree - minute / 60) * 3600).toFixed(1)
  var symbol = ""
  if (type == "lng" && num < 0) {
    symbol = "S"
  } else if (type == "lng" && num >= 0) {
    symbol = "N"
  } else if (type == "lat" && num < 0) {
    symbol = "W"
  } else if (type == "lat" && num >= 0) {
    symbol = "E"
  }

  return `${degree}°${minute}'${second}\"${symbol}`
}
