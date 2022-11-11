import { NextPage } from "next"
import React, { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Material, Mesh, BufferGeometry } from "three"
import { OrbitControls } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { BloomEffect, KernelSize } from "postprocessing"
import { Button } from "@mantine/core"

import CapsuleSphereGlb from "@/view/ar/CapsuleSphereGlb"

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
  const [animation, setAnimation] = useState(false)

  return (
    <div className="fixed inset-0">
      <Button onClick={() => setAnimation((v) => !v)}>Open</Button>
      <Canvas>
        <Suspense fallback={null}>
          <CapsuleSphereGlb position={[0, 0, 0]} animation={animation} />
        </Suspense>
        <OrbitControls />
        <gridHelper />
        <Effect animation={animation} />
      </Canvas>
    </div>
  )
}

export default ThreeD

export const Effect: React.FC<{ animation?: boolean }> = ({ animation }) => {
  const ref = useRef<typeof BloomEffect | null>(null)

  useFrame(() => {
    const bloom = ref.current
    if (bloom == null || !animation) {
      return
    }
    const MAX = 8
    // @ts-ignore
    bloom.intensity += MAX / 300

    // @ts-ignore
    if (MAX < bloom.intensity) {
      // @ts-ignore
      bloom.intensity = 0
    }
  })

  return (
    <EffectComposer multisampling={8}>
      <Bloom
        kernelSize={3}
        luminanceThreshold={0}
        luminanceSmoothing={0.4}
        intensity={0.6}
        ref={ref}
      />
      <Bloom
        kernelSize={KernelSize.HUGE}
        luminanceThreshold={0}
        luminanceSmoothing={0}
        intensity={0.5}
      />
    </EffectComposer>
  )
}
