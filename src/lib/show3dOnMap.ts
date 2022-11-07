import { Map, MercatorCoordinate } from "mapbox-gl"
import { Scene, Euler, Matrix4, Vector3, Camera, WebGLRenderer, DirectionalLight } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import { Feature } from "@/types/feature"

type SceneTransform = {
  matrix: Matrix4
  origin: Vector3
  meterScale: number
}

const addLightToScene = (x: number, y: number, z: number, baseScene: Scene) => {
  const directionalLight = new DirectionalLight(0xffffff)
  directionalLight.position.set(x, y, z).normalize()
  baseScene.add(directionalLight)
}

const addFeatureToScene = (
  feature: Feature,
  sceneTransform: SceneTransform,
  baseScene: Scene,
  loader: GLTFLoader,
) => {
  const modelOrigin = [feature.geometry.coordinates[0], feature.geometry.coordinates[1]] as [
    number,
    number,
  ]
  const modelAltitude = 0
  const modelRotate = new Euler(Math.PI / 2, 0, 0, "XYZ")
  const featureid = feature.properties.id

  const mc = MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude)
  loader.load("/models/capsule3.glb", (gltf) => {
    const scene = gltf.scene
    const origin = sceneTransform.origin
    scene.position.set(
      (mc.x - origin.x) / sceneTransform.meterScale,
      -(mc.y - origin.y) / sceneTransform.meterScale,
      ((mc.z as number) - origin.z) / sceneTransform.meterScale,
    )
    scene.quaternion.setFromEuler(modelRotate)
    scene.name = featureid
    baseScene.add(gltf.scene)
  })
}

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

  const sceneTransform: SceneTransform = {
    matrix: new Matrix4()
      .makeTranslation(mc.x, mc.y, mc.z as number)
      .scale(new Vector3(meterScale, -meterScale, meterScale)),
    origin: new Vector3(mc.x, mc.y, mc.z),
    meterScale: meterScale,
  }

  let renderer: THREE.WebGLRenderer | null = null

  // configuration of the custom layer for a 3D model per the CustomLayerInterface
  const featureLayer: mapboxgl.AnyLayer = {
    id: id,
    type: "custom",
    renderingMode: "3d",

    onAdd: (map, gl) => {
      addLightToScene(0, -70, 100, baseScene)
      addLightToScene(0, 70, 100, baseScene)

      const loader = new GLTFLoader()
      // use the three.js GLTF loader to add the 3D model to the three.js scene
      for (let i = 0; i < features.length; i++) {
        addFeatureToScene(features[i], sceneTransform, baseScene, loader)
      }

      // use the Mapbox GL JS map canvas for three.js
      renderer = new WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      })

      renderer!.autoClear = false
    },

    render: (_gl, matrix) => {
      camera.projectionMatrix = new Matrix4().fromArray(matrix).multiply(sceneTransform.matrix)
      renderer?.state.reset()
      renderer?.render(baseScene, camera)
      map.triggerRepaint()
    },
  }

  return featureLayer
}
