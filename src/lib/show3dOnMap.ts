import { Map, MercatorCoordinate } from "mapbox-gl"
import { Scene, Euler, Matrix4, Vector3, AmbientLight, Camera, WebGLRenderer } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import { Feature } from "@/types/feature"

const addFeatureToScene = (feature: Feature, baseScene: Scene, loader: GLTFLoader) => {
  const modelOrigin = [feature.geometry.coordinates[0], feature.geometry.coordinates[1]] as [
    number,
    number,
  ]
  const modelAltitude = 0
  const modelRotate = new Euler(Math.PI / 2, 0, 0, "XYZ")

  const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude)

  const meterScale = modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()

  loader.load("/models/capsule3.glb", (gltf) => {
    const scene = gltf.scene
    scene.position.set(
      (modelAsMercatorCoordinate.x - modelOrigin[0]) / meterScale,
      -(modelAsMercatorCoordinate.y - modelOrigin[1]) / meterScale,
      0,
    )
    scene.quaternion.setFromEuler(modelRotate)
    // scene.scale.set(modelScale, modelScale, modelScale)
    baseScene.add(gltf.scene)
  })
}

// export const show3dOnMap = (
//   features: Feature[],
//   id: string,
//   map: Map,
//   camera: Camera,
//   scene: Scene,
// ) => {
//   // parameters to ensure the model is georeferenced correctly on the map
//   const baseOrigin = [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]] as [
//     number,
//     number,
//   ]
//   const modelAltitude = 0
//   const modelRotate = [Math.PI / 2, 0, 0]

//   const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(baseOrigin, modelAltitude)

//   // transformation parameters to position, rotate and scale the 3D model onto the map
//   const modelTransform = {
//     translateX: modelAsMercatorCoordinate.x,
//     translateY: modelAsMercatorCoordinate.y,
//     translateZ: modelAsMercatorCoordinate.z,
//     rotateX: modelRotate[0],
//     rotateY: modelRotate[1],
//     rotateZ: modelRotate[2],
//     /* Since the 3D model is in real world meters, a scale transform needs to be
//      * applied since the CustomLayerInterface expects units in MercatorCoordinates.
//      */
//     scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
//   }

//   // const camera = new Camera()
//   let renderer: THREE.WebGLRenderer | null = null

//   // configuration of the custom layer for a 3D model per the CustomLayerInterface
//   const customLayer: mapboxgl.AnyLayer = {
//     id: id,
//     type: "custom",
//     renderingMode: "3d",
//     onAdd: function (map, gl) {
//       // create two three.js lights to illuminate the model
//       const directionalLight = new DirectionalLight(0xffffff)
//       directionalLight.position.set(0, -70, 100).normalize()
//       scene.add(directionalLight)

//       const directionalLight2 = new DirectionalLight(0xffffff)
//       directionalLight2.position.set(0, 70, 100).normalize()
//       scene.add(directionalLight2)

//       // use the three.js GLTF loader to add the 3D model to the three.js scene
//       const loader = new GLTFLoader()
//       features.forEach((feature) => {
//         addFeatureToScene(feature, scene, loader)
//       })

//       // loader.load("/models/capsule3.glb", (gltf) => {
//       //   scene.add(gltf.scene)
//       // })

//       // use the Mapbox GL JS map canvas for three.js
//       renderer = new WebGLRenderer({
//         canvas: map.getCanvas(),
//         context: gl,
//         antialias: true,
//       })

//       renderer!.autoClear = false
//     },
//     render: function (gl, matrix) {
//       const rotationX = new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), modelTransform.rotateX)
//       const rotationY = new Matrix4().makeRotationAxis(new Vector3(0, 1, 0), modelTransform.rotateY)
//       const rotationZ = new Matrix4().makeRotationAxis(new Vector3(0, 0, 1), modelTransform.rotateZ)

//       const m = new Matrix4().fromArray(matrix)
//       const l = new Matrix4()
//         .makeTranslation(
//           modelTransform.translateX,
//           modelTransform.translateY,
//           modelTransform.translateZ as number,
//         )
//         .scale(
//           new Vector3(
//             modelTransform.scale * 0.5,
//             -modelTransform.scale * 0.5,
//             modelTransform.scale * 0.5,
//           ),
//         )
//         .multiply(rotationX)
//         .multiply(rotationY)
//         .multiply(rotationZ)

//       camera.projectionMatrix = m.multiply(l)
//       renderer?.resetState()
//       renderer?.render(scene, camera)
//       map.triggerRepaint()
//     },
//   }

//   console.log(customLayer)
//   console.log(scene)

//   return customLayer
// }

export const show3dOnMap = (
  features: Feature[],
  id: string,
  map: Map,
  camera: Camera,
  baseScene: Scene,
) => {
  const mc = MercatorCoordinate.fromLngLat(
    [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]],
    0,
  )
  const meterScale = mc.meterInMercatorCoordinateUnits()

  var sceneTransform = {
    matrix: new Matrix4()
      .makeTranslation(mc.x, mc.y, mc.z as number)
      .scale(new Vector3(meterScale, -meterScale, meterScale)),
    origin: new Vector3(mc.x, mc.y, mc.z),
  }

  let renderer: THREE.WebGLRenderer | null = null

  // configuration of the custom layer for a 3D model per the CustomLayerInterface
  const customLayer3: mapboxgl.AnyLayer = {
    id: id,
    type: "custom",
    renderingMode: "3d",

    onAdd: function (map, gl) {
      // create two three.js lights to illuminate the model
      var light1 = new AmbientLight(0xffffff)
      light1.position.set(0, -70, 100).normalize()
      baseScene.add(light1)

      var light2 = new AmbientLight(0xffffff)
      light2.position.set(0, 70, 100).normalize()
      baseScene.add(light2)

      var loader = new GLTFLoader()
      // use the three.js GLTF loader to add the 3D model to the three.js scene
      for (var i = 0; i < features.length; i++) {
        const modelOrigin3 = [
          features[i].geometry.coordinates[0],
          features[i].geometry.coordinates[1],
        ] as [number, number]
        const modelAltitude3 = 0
        const modelRotate3 = new Euler(Math.PI / 2, 0, 0, "XYZ")
        const modelScale = 1
        const featureid = features[i].properties.id

        const mc = MercatorCoordinate.fromLngLat(modelOrigin3, modelAltitude3)
        loader.load("/models/capsule3.glb", (gltf) => {
          const scene = gltf.scene
          const origin = sceneTransform.origin
          scene.position.set(
            (mc.x - origin.x) / meterScale,
            -(mc.y - origin.y) / meterScale,
            ((mc.z as number) - origin.z) / meterScale,
          )
          scene.quaternion.setFromEuler(modelRotate3)
          scene.scale.set(modelScale, modelScale, modelScale)
          scene.name = featureid
          baseScene.add(gltf.scene)
        })
      }

      // use the Mapbox GL JS map canvas for three.js
      renderer = new WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      })

      renderer!.autoClear = false
    },

    render: function (gl, matrix) {
      camera.projectionMatrix = new Matrix4().fromArray(matrix).multiply(sceneTransform.matrix)
      renderer?.state.reset()
      renderer?.render(baseScene, camera)
      map.triggerRepaint()
    },
  }

  return customLayer3
}
