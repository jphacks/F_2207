import { NextPage } from "next"
import React, { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Material, Mesh, BufferGeometry } from "three"
import { OrbitControls } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { KernelSize } from "postprocessing"

import { Model } from "@/view/ar/CapsuleTest"

// const Triangle: React.FC = ({ color, ...props }) => {
//   const ref = useRef()
//   const [r] = useState(() => Math.random() * 10000)
//   useFrame((_) => (ref.current.position.y = -1.75 + Math.sin(_.clock.elapsedTime + r) / 10))
//   const { paths: [path] } = useLoader(SVGLoader, '/triangle.svg') // prettier-ignore
//   const geom = useMemo(
//     () => SVGLoader.pointsToStroke(path.subPaths[0].getPoints(), path.userData.style),
//     [],
//   )
//   return (
//     <group ref={ref}>
//       <mesh geometry={geom} {...props}>
//         <meshBasicMaterial color={color} toneMapped={false} />
//       </mesh>
//     </group>
//   )
// }

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
      <boxGeometry args={[1, 1, 1]} />
      {/* <meshStandardMaterial color={hovered ? "hotpink" : "orange"} /> */}
      <arrowHelper />
      <meshBasicMaterial color="red" toneMapped={false} />
    </mesh>
  )
}

const ThreeD: NextPage = () => {
  return (
    <div className="fixed inset-0">
      <Canvas>
        {/* <ambientLight /> */}
        {/* <pointLight position={[10, 10, 10]} /> */}
        {/* <Box position={[-1.2, 0, 0]} /> */}
        {/* <Box position={[1.2, 0, 0]} /> */}
        <Suspense fallback={null}>
          <Model position={[0, 0, 0]} />
        </Suspense>
        {/* <Triangle position={[0, 0, 0]} /> */}
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
