/* eslint-disable react/no-unknown-property */

import React, { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { DoubleSide } from "three"

export function Capsule2ndModel(props) {
  const { nodes, materials } = useGLTF("/models/capsule_2nd.glb")

  const metalMaterial = useMemo(
    () => <meshStandardMaterial color="#666666" metalness={0} roughness={1} shininess={200} />,
    [],
  )

  const glassMaterial = useMemo(
    () => <meshStandardMaterial color="rgb(0,255,50)" side={DoubleSide} />,
    [],
  )

  return (
    <group {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh geometry={nodes.チューブ.geometry} material={nodes.チューブ.material}>
          {metalMaterial}
        </mesh>
        <mesh geometry={nodes.チューブ_1.geometry} material={nodes.チューブ_1.material}>
          {metalMaterial}
        </mesh>
        <mesh geometry={nodes.トーラス.geometry} material={nodes.トーラス.material}>
          {metalMaterial}
        </mesh>
        <group position={[0, 0, 12.8]} scale={[1, 1, 0.4]}>
          <mesh
            geometry={nodes.球体_0_4.geometry}
            material={nodes.球体_0_4.material}
            position={[0, -52.86, 0]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_10_5.geometry}
            material={nodes.球体_10_5.material}
            position={[14.89, 50.72, 0]}
            rotation={[0, 0, 2.86]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_11_4.geometry}
            material={nodes.球体_11_4.material}
            position={[0, 52.86, 0]}
            rotation={[0, 0, Math.PI]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_12_5.geometry}
            material={nodes.球体_12_5.material}
            position={[-14.89, 50.72, 0]}
            rotation={[0, 0, -2.86]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_13_4.geometry}
            material={nodes.球体_13_4.material}
            position={[-28.58, 44.47, 0]}
            rotation={[0, 0, -2.57]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_14_5.geometry}
            material={nodes.球体_14_5.material}
            position={[-39.95, 34.62, 0]}
            rotation={[0, 0, -2.28]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_15_4.geometry}
            material={nodes.球体_15_4.material}
            position={[-48.09, 21.96, 0]}
            rotation={[0, 0, -2]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_16_5.geometry}
            material={nodes.球体_16_5.material}
            position={[-52.32, 7.52, 0]}
            rotation={[0, 0, -1.71]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_17_4.geometry}
            material={nodes.球体_17_4.material}
            position={[-52.32, -7.52, 0]}
            rotation={[0, 0, -1.43]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_18_5.geometry}
            material={nodes.球体_18_5.material}
            position={[-48.09, -21.96, 0]}
            rotation={[0, 0, -1.14]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_19_4.geometry}
            material={nodes.球体_19_4.material}
            position={[-39.95, -34.62, 0]}
            rotation={[0, 0, -0.86]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_1_4.geometry}
            material={nodes.球体_1_4.material}
            position={[14.89, -50.72, 0]}
            rotation={[0, 0, 0.29]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_20_5.geometry}
            material={nodes.球体_20_5.material}
            position={[-28.58, -44.47, 0]}
            rotation={[0, 0, -0.57]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_21_4.geometry}
            material={nodes.球体_21_4.material}
            position={[-14.89, -50.72, 0]}
            rotation={[0, 0, -0.29]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_2_5.geometry}
            material={nodes.球体_2_5.material}
            position={[28.58, -44.47, 0]}
            rotation={[0, 0, 0.57]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_3_4.geometry}
            material={nodes.球体_3_4.material}
            position={[39.95, -34.62, 0]}
            rotation={[0, 0, 0.86]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_4_5.geometry}
            material={nodes.球体_4_5.material}
            position={[48.09, -21.96, 0]}
            rotation={[0, 0, 1.14]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_5_4.geometry}
            material={nodes.球体_5_4.material}
            position={[52.32, -7.52, 0]}
            rotation={[0, 0, 1.43]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_6_5.geometry}
            material={nodes.球体_6_5.material}
            position={[52.32, 7.52, 0]}
            rotation={[0, 0, 1.71]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_7_4.geometry}
            material={nodes.球体_7_4.material}
            position={[48.09, 21.96, 0]}
            rotation={[0, 0, 2]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_8_5.geometry}
            material={nodes.球体_8_5.material}
            position={[39.95, 34.62, 0]}
            rotation={[0, 0, 2.28]}
          >
            {metalMaterial}
          </mesh>
          <mesh
            geometry={nodes.球体_9_4.geometry}
            material={nodes.球体_9_4.material}
            position={[28.58, 44.47, 0]}
            rotation={[0, 0, 2.57]}
          >
            {metalMaterial}
          </mesh>
        </group>
        <mesh
          geometry={nodes.球体_0.geometry}
          material={nodes.球体_0.material}
          position={[0, -57.03, 0]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_10_2.geometry}
          material={nodes.球体_10_2.material}
          position={[16.07, 54.72, 0]}
          rotation={[0, 0, 2.86]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_11_2.geometry}
          material={nodes.球体_11_2.material}
          position={[0, 57.03, 0]}
          rotation={[0, 0, Math.PI]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_12_2.geometry}
          material={nodes.球体_12_2.material}
          position={[-16.07, 54.72, 0]}
          rotation={[0, 0, -2.86]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_13_2.geometry}
          material={nodes.球体_13_2.material}
          position={[-30.83, 47.97, 0]}
          rotation={[0, 0, -2.57]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_14_2.geometry}
          material={nodes.球体_14_2.material}
          position={[-43.1, 37.34, 0]}
          rotation={[0, 0, -2.28]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_15_2.geometry}
          material={nodes.球体_15_2.material}
          position={[-51.87, 23.69, 0]}
          rotation={[0, 0, -2]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_16_2.geometry}
          material={nodes.球体_16_2.material}
          position={[-56.45, 8.12, 0]}
          rotation={[0, 0, -1.71]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_17_2.geometry}
          material={nodes.球体_17_2.material}
          position={[-56.45, -8.12, 0]}
          rotation={[0, 0, -1.43]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_18_2.geometry}
          material={nodes.球体_18_2.material}
          position={[-51.87, -23.69, 0]}
          rotation={[0, 0, -1.14]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_19_2.geometry}
          material={nodes.球体_19_2.material}
          position={[-43.1, -37.34, 0]}
          rotation={[0, 0, -0.86]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_1_2.geometry}
          material={nodes.球体_1_2.material}
          position={[16.07, -54.72, 0]}
          rotation={[0, 0, 0.29]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_20_2.geometry}
          material={nodes.球体_20_2.material}
          position={[-30.83, -47.97, 0]}
          rotation={[0, 0, -0.57]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_21_2.geometry}
          material={nodes.球体_21_2.material}
          position={[-16.07, -54.72, 0]}
          rotation={[0, 0, -0.29]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_2_2.geometry}
          material={nodes.球体_2_2.material}
          position={[30.83, -47.97, 0]}
          rotation={[0, 0, 0.57]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_3_2.geometry}
          material={nodes.球体_3_2.material}
          position={[43.1, -37.34, 0]}
          rotation={[0, 0, 0.86]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_4_2.geometry}
          material={nodes.球体_4_2.material}
          position={[51.87, -23.69, 0]}
          rotation={[0, 0, 1.14]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_5_2.geometry}
          material={nodes.球体_5_2.material}
          position={[56.45, -8.12, 0]}
          rotation={[0, 0, 1.43]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_6_2.geometry}
          material={nodes.球体_6_2.material}
          position={[56.45, 8.12, 0]}
          rotation={[0, 0, 1.71]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_7_2.geometry}
          material={nodes.球体_7_2.material}
          position={[51.87, 23.69, 0]}
          rotation={[0, 0, 2]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_8_2.geometry}
          material={nodes.球体_8_2.material}
          position={[43.1, 37.34, 0]}
          rotation={[0, 0, 2.28]}
        >
          {metalMaterial}
        </mesh>
        <mesh
          geometry={nodes.球体_9_2.geometry}
          material={nodes.球体_9_2.material}
          position={[30.83, 47.97, 0]}
          rotation={[0, 0, 2.57]}
        >
          {metalMaterial}
        </mesh>
      </group>
      {/* <mesh
        geometry={nodes.上カプセル未開封.geometry}
        // material={materials.マテリアル}
        position={[0.01, 0.13, -0.5]}
        scale={[0.49, 0.48, 0.49]}
      >
        {glassMaterial}
      </mesh> */}
      <mesh
        geometry={nodes.下カプセル.geometry}
        // material={materials.マテリアル}
        position={[0, -0.12, 0]}
        rotation={[0, 0, Math.PI]}
        scale={[0.49, 0.48, 0.49]}
      >
        {glassMaterial}
      </mesh>
      <pointLight position={[1, 0, 1]} intensity={0.3} />
      <pointLight position={[-1, 0, -1]} intensity={0.3} />
      <ambientLight intensity={0.2} />
      <mesh
        geometry={nodes.上カプセル開封.geometry}
        // material={materials.マテリアル}

        position={[0.01, 0.13, -0.5]}
        rotation={[-0.76, 0, 0]}
        scale={[0.49, 0.48, 0.49]}
      >
        {glassMaterial}
      </mesh>
    </group>
  )
}

useGLTF.preload("/capsule_2nd.glb")
