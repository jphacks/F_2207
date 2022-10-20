import { useFrame } from "@react-three/fiber"
import { MutableRefObject } from "react"

import { Orientation } from "@/lib/useOrientation"

export const useSyncCamera = (
  _orientation: MutableRefObject<Orientation>,
  position: { x: number; y: number; z: number },
) => {
  useFrame(({ camera }) => {
    const orientation = _orientation.current
    const distance = 1
    camera.position.set(position.x, position.y, position.z)

    const a = distance * Math.cos(orientation.x * (Math.PI / 180))
    const b =
      distance *
      // Math.sin(-orientation.x * (Math.PI / 180)) *
      Math.sin((orientation.y - 90) * (Math.PI / 180))
    const c =
      -distance *
      Math.sin(orientation.x * (Math.PI / 180)) *
      Math.cos((orientation.y - 90) * (Math.PI / 180))

    camera.lookAt(
      (camera.position.x + (camera.position.x + c)) * 0.5,
      (camera.position.y + (camera.position.y + b)) * 0.5,
      (camera.position.z + (camera.position.z + a)) * 0.5,
    )
  })
}
