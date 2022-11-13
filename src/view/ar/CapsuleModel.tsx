import { useRef, Suspense } from "react"
import { useFrame } from "@react-three/fiber"
import THREE from "three"
import { Html } from "@react-three/drei"

import CapsuleDistance from "@/view/ar/CapsuleDistance"
import CapsuleSphereGlb from "@/view/ar/CapsuleSphereGlb"

export type CapsuleModelProps = {
  color: string
  distance: number
  renderDistance: number
  position: [number, number, number]
  onClick?: () => void
}

const CapsuleModel: React.FC<CapsuleModelProps> = ({
  color,
  distance,
  renderDistance,
  position,
  onClick,
}) => {
  const ref = useRef<THREE.Mesh | null>(null)
  useFrame(() => {
    if (ref.current == null) {
      return
    }
    ref.current.rotation.z += 0.003
    ref.current.rotation.y += 0.002
  })

  const scale = Math.max(100, Math.round(renderDistance * 20))

  return (
    <>
      {renderDistance <= 100 && (
        <Suspense fallback={null}>
          {/* @ts-ignore */}
          <CapsuleSphereGlb position={position} scale={[4, 4, 4]} color={color} onClick={onClick} />
        </Suspense>
      )}
      <mesh>
        <Html
          className="text-2xl"
          center
          distanceFactor={10}
          position={[
            position[0],
            position[1] +
              20 / (100 / renderDistance) +
              (renderDistance >= 5 ? 25 / renderDistance : 0),
            position[2],
          ]}
        >
          <div style={{ transform: `scale(${scale}%)` }} onClick={onClick}>
            <CapsuleDistance capsuleColor={color} distance={distance} />
          </div>
        </Html>
      </mesh>
    </>
  )
}

export default CapsuleModel
