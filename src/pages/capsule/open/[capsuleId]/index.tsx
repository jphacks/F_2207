import { NextPage } from "next"
import { Fragment, MutableRefObject, useEffect, useMemo, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import Webcam from "react-webcam"
import { Button, Loader, Modal } from "@mantine/core"
import { Text } from "@mantine/core"
import { useRouter } from "next/router"

import { useGeolocation } from "@/provider/GpsProvider"
import { useOrientation } from "@/lib/useOrientation"
import { useSyncCamera } from "@/lib/threejs/useSyncCamera"
import { calcDistance } from "@/lib/calcDistance"
import { Capsule } from "@/types/capsule"
import MetaHeader from "@/view/common/MetaHeader"
import CapsuleModel from "@/view/ar/CapsuleModel"
import CylinderGuide from "@/view/ar/CylinderGuide"
import { convertLngLat } from "@/lib/convertLngLat"
import { useCapsules } from "@/hooks/useCapsules"
import DiscoverDrawer from "@/view/DiscoverDrawer"

const CLOSE_DISTANCE_THRESHOLD = 500

type CapsulePosition = Capsule & {
  x: number
  y: number
  z: number
  distance: number
  renderDistance: number
  color: string
}

const ArCanvas: React.FC<{
  orientation: MutableRefObject<{ x: number; y: number }>
  capsulePositions: MutableRefObject<CapsulePosition[]>
  onClick: (capsulePosition: CapsulePosition) => void
}> = ({ orientation, capsulePositions, onClick }) => {
  useSyncCamera(orientation, { x: 0, y: 8, z: 0 })

  // const effector = useMemo(
  //   () => (
  //     <EffectComposer multisampling={8}>
  //       <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} />
  //       <Bloom
  //         kernelSize={KernelSize.SMALL}
  //         luminanceThreshold={0}
  //         luminanceSmoothing={0}
  //         intensity={0.5}
  //       />
  //     </EffectComposer>
  //   ),
  //   [],
  // )

  return (
    <>
      {capsulePositions.current.map((capsulePosition) => (
        <Fragment key={capsulePosition.id}>
          <CapsuleModel
            position={[capsulePosition.x * 2.5, capsulePosition.y, capsulePosition.z * 2.5]}
            color={capsulePosition.color}
            distance={capsulePosition.distance}
            renderDistance={capsulePosition.renderDistance}
            onClick={() => onClick(capsulePosition)}
          />
          <CylinderGuide
            position={[capsulePosition.x, capsulePosition.y + 30, capsulePosition.z]}
            scale={[5, 5, 5]}
            color="#d8cb52"
          />
        </Fragment>
      ))}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <gridHelper args={[100]} />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <fog attach="fog" color="#000" near={30} far={200} />
      {/* {effector} */}
    </>
  )
}

const ArPage: React.FC<{ capsules: Capsule[] }> = ({ capsules }) => {
  const router = useRouter()
  const layerID = router.query.layerId as string
  const featureID = router.query.featureId as string
  const { orientation, orientationRef, requestPermission, isReady } = useOrientation()
  const geolocation = useGeolocation()
  const [cameraReady, setCameraReady] = useState(false)

  const capsuleGeoData = useMemo(() => {
    if (geolocation == null) {
      return []
    }
    const capsuleGeoData = capsules.map((capsule) => {
      const { distance, bearing } = calcDistance(
        { latitude: geolocation.latitude, longitude: geolocation.longitude },
        {
          latitude: capsule.latitude + 0.0002,
          longitude: capsule.longitude,
        },
      )
      return {
        ...capsule,
        distance,
        renderDistance: Math.min(100, 10),
        bearing,
        deviceBearing: orientation.x - bearing,
      }
    })
    return capsuleGeoData
  }, [capsules, geolocation, orientation.x])

  const sortedCapsuleGeoData = useMemo(() => {
    const ret = [...capsuleGeoData].sort((a, b) =>
      a.distance > b.distance ? 1 : a.distance === b.distance ? 0 : -1,
    )
    return ret.slice(0, 5).filter(({ distance }) => distance <= 500)
  }, [capsuleGeoData])

  const capsulePositions = useMemo(
    () =>
      sortedCapsuleGeoData.map((geo) => {
        const degree = 90 - geo.bearing
        return {
          x: -geo.renderDistance * Math.cos(degree * (Math.PI / 180)),
          y: 0,
          z: geo.renderDistance * Math.sin(degree * (Math.PI / 180)),
          ...geo,
        }
      }),
    [sortedCapsuleGeoData],
  )

  const capsulePositionsRef = useRef(capsulePositions)
  useEffect(() => {
    capsulePositionsRef.current = capsulePositions
  }, [capsulePositions])

  const [discoverCapsule, setDiscoverCapsule] = useState<Capsule | null>(null)

  const handleClickCapsule = (capsule: CapsulePosition) => {
    if (capsule.distance < CLOSE_DISTANCE_THRESHOLD) {
      setDiscoverCapsule(capsule)
    } else {
      window.alert("近づいて開けてみましょう")
    }
  }

  return (
    <>
      <MetaHeader title="探す" />
      <div className="relative">
        <Webcam
          onUserMedia={() => setCameraReady(true)}
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
              {convertLngLat(geolocation.longitude, "lng") +
                "\n" +
                convertLngLat(geolocation.latitude, "lat")}
            </Text>
          </div>
        )}
      </div>
      <div className="fixed inset-0">
        <Canvas>
          <ArCanvas
            orientation={orientationRef}
            capsulePositions={capsulePositionsRef}
            onClick={handleClickCapsule}
          />
        </Canvas>
      </div>
      <Modal
        centered
        opened={!isReady && cameraReady}
        onClose={requestPermission}
        withCloseButton={false}
      >
        <div className="flex flex-col items-center">
          <p>デバイスの姿勢情報にアクセスします</p>
          <Button onClick={requestPermission}>OK</Button>
        </div>
      </Modal>
      {discoverCapsule != null && (
        <DiscoverDrawer
          href={`/capsule/open/${discoverCapsule.id}/shake`}
          capsule={discoverCapsule}
          open={discoverCapsule != null}
          layerID={layerID}
          featureID={featureID}
          onClose={() => setDiscoverCapsule(null)}
        />
      )}
    </>
  )
}

const CapsulePage: NextPage = () => {
  const router = useRouter()
  const capsuleId = router.query.capsuleId as string
  const capsules = useCapsules()

  if (capsules.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader aria-label="ロード中" />
      </div>
    )
  } else {
    return <ArPage capsules={capsules} />
  }
}

export default CapsulePage
