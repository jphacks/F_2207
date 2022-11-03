import { useMemo, useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Html } from "@react-three/drei"

import CapsuleDistance from "@/view/ar/CapsuleDistance"

export type CapsuleModelProps = {
  color: string
  distance: number
  position: [number, number, number]
  onClick?: () => void
}

const CapsuleModel: React.FC<CapsuleModelProps> = ({ color, distance, position, onClick }) => {
  const ref = useRef<THREE.Mesh | null>(null)
  const { scene } = useLoader(GLTFLoader, "/models/capsule3.glb")
  const copiedScene = useMemo(() => {
    return scene.clone()
  }, [scene])

  useFrame(() => {
    if (ref.current == null) {
      return
    }
    ref.current.rotation.z += 0.003
    ref.current.rotation.y += 0.002
  })

  const scale = Math.max(400, Math.round(distance * 7))

  return (
    <>
      <mesh position={position} scale={[0.05, 0.05, 0.05]} onClick={onClick}>
        <primitive ref={ref} distanceFactor={10} object={copiedScene} />
      </mesh>
      <mesh>
        <Html
          className="text-2xl"
          center
          distanceFactor={10}
          position={[position[0], position[1] + 10, position[2]]}
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
