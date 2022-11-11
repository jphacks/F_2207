import { Map, MercatorCoordinate } from "mapbox-gl"
import {
  Camera,
  DirectionalLight,
  Euler,
  Matrix4,
  Scene,
  Vector3,
  WebGLRenderer,
  Object3D,
  Mesh,
  BufferGeometry,
  AmbientLight,
} from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils"

import { Feature } from "@/types/feature"

type SceneTransform = {
  matrix: Matrix4
  origin: Vector3
  meterScale: number
}

const addLightToScene = (x: number, y: number, z: number, baseScene: Scene) => {
  const directionalLight = new DirectionalLight(0xffffff, 0.3)
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
  loader.load("/models/capsule_ball.glb", (gltf) => {
    const scene = gltf.scene
    const origin = sceneTransform.origin
    scene.position.set(
      (mc.x - origin.x) / sceneTransform.meterScale,
      -(mc.y - origin.y) / sceneTransform.meterScale,
      ((mc.z as number) - origin.z) / sceneTransform.meterScale,
    )
    scene.scale.set(50, 50, 50)
    scene.quaternion.setFromEuler(modelRotate)
    scene.name = featureid
    scene.traverse((object) => {
      if (object instanceof Mesh && object.name.includes("カプセル")) {
        // set color of body
        object.material.emissive.r = 0.591
        object.material.emissive.g = 0.905
        object.material.emissive.b = 0.381
        object.material.emissiveIntensity = 0.8
      } else if (object instanceof Mesh) {
        // set color of connection parts
        object.material.color.r = 0.799
        object.material.color.g = 0.799
        object.material.color.b = 0.799
        object.material.emissive.r = 0.799
        object.material.emissive.g = 0.799
        object.material.emissive.b = 0.799
      }
      if (object instanceof Object3D) {
        // @ts-ignore
        if (object.geometry !== undefined) {
          // @ts-ignore
          const a = object.geometry.isBufferGeometry
            ? // @ts-ignore
              object.geometry
            : // @ts-ignore
              new BufferGeometry(object.geometry)
          const b = mergeVertices(a)
          b.computeVertexNormals()
          // @ts-ignore
          object.geometry = b
        }
      }
    })
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
      addLightToScene(1, 0, 1, baseScene)
      addLightToScene(-1, 0, 1 - 1, baseScene)
      addLightToScene(0.7, 0, 1, baseScene)
      baseScene.add(new AmbientLight(undefined, 0.5))

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
      renderer.physicallyCorrectLights = true
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
