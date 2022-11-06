import { useFrame } from "@react-three/fiber"
import React, { useRef } from "react"

export type CylinderProps = {
  position: [number, number, number]
  scale: [number, number, number]
  color: string
}

const CylinderGuide: React.FC<CylinderProps> = ({ position, scale, color }) => {
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
    // eslint-disable-next-line react/no-unknown-property
    <mesh ref={ref} position={position} scale={scale}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <cylinderGeometry args={[0.5, 0, 1, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default CylinderGuide
