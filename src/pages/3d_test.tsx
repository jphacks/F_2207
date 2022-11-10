import { NextPage } from "next"
import React, { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Material, Mesh, BufferGeometry } from "three"
import { OrbitControls } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { KernelSize } from "postprocessing"

import { Capsule2ndModel } from "@/view/ar/Capsule2ndModel"

const Box: React.FC = (props) => {
  const ref = useRef<Mesh<BufferGeometry, Material | Material[]> | null>(null)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame((state, delta) => {
    const mesh = ref.current
    if (mesh == null) {
      return
    }
    mesh.rotation.x += 0.01
  })

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      {/* eslint-disable-next-line react/no-unknown-property */}
      <boxGeometry args={[1, 1, 1]} />
      <arrowHelper />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <meshBasicMaterial color="red" toneMapped={false} />
    </mesh>
  )
}

const ThreeD: NextPage = () => {
  return (
    <div className="fixed inset-0">
      <Canvas>
        <Suspense fallback={null}>
          <Capsule2ndModel position={[0, 0, 0]} />
        </Suspense>
        <OrbitControls />
        <gridHelper />
        <EffectComposer multisampling={8}>
          <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} />
          <Bloom
            kernelSize={KernelSize.HUGE}
            luminanceThreshold={0}
            luminanceSmoothing={0}
            intensity={0.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default ThreeD
