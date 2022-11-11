import React, { Suspense, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { BloomEffect, KernelSize } from "postprocessing"

import CapsuleSphereGlb from "@/view/ar/CapsuleSphereGlb"

export type ShakeCapsuleModelProps = {
  openRateRef: React.MutableRefObject<number>
}

const ShakeCapsuleModel: React.FC<ShakeCapsuleModelProps> = ({ openRateRef }) => {
  return (
    <>
      <Suspense fallback={null}>
        <CapsuleSphereGlb
          position={[0, -0.4, 3.5]}
          rotation={[0.05, 0, 0]}
          animation
          // maxAnimationRate={openRate / 100}
          openRateRef={openRateRef}
        />
      </Suspense>
      {/* <Effect animation openRateRef={openRateRef} /> */}
    </>
  )
}

export default ShakeCapsuleModel

const Effect: React.FC<{ animation?: boolean; openRateRef: React.MutableRefObject<number> }> = ({
  animation,
  openRateRef,
}) => {
  const ref = useRef<typeof BloomEffect | null>(null)

  useFrame(() => {
    const bloom = ref.current
    if (bloom == null || !animation) {
      return
    }
    const MAX = 8

    // @ts-ignore
    if (bloom.intensity <= MAX * (openRateRef.current ?? 1)) {
      // @ts-ignore
      bloom.intensity += MAX / 300
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
