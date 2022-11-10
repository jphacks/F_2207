import { Map, MercatorCoordinate } from "mapbox-gl"
import {
  Scene,
  Euler,
  Matrix4,
  Vector3,
  Camera,
  DirectionalLight,
  WebGLRenderer,
  Mesh,
  MeshStandardMaterial,
  DoubleSide,
  AmbientLight,
} from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

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
  loader.load("/models/capsule_2nd.glb", (gltf) => {
    const scene = gltf.scene
    console.log(gltf.scene)
    scene.children
      .filter((mesh) => mesh instanceof Mesh)
      .map((mesh) => {
        // @ts-ignore
        mesh.material = new MeshStandardMaterial({ color: "rgb(0,255,50)", side: DoubleSide })
        // meshStandardMaterial color="rgb(0,255,50)" side={DoubleSide}
      })
    const origin = sceneTransform.origin
    scene.position.set(
      (mc.x - origin.x) / sceneTransform.meterScale,
      -(mc.y - origin.y) / sceneTransform.meterScale,
      ((mc.z as number) - origin.z) / sceneTransform.meterScale,
    )
    scene.scale.set(20, 20, 20)
    scene.quaternion.setFromEuler(modelRotate)
    scene.name = featureid
    baseScene.add(gltf.scene)
  })

  // var element = document.createElement("div")
  // element.style.width = "30px"
  // element.style.height = "30px"
  // element.style.opacity = "0.999"
  // element.style.background = new Color(
  //   Math.random() * 0.21568627451 + 0.462745098039,
  //   Math.random() * 0.21568627451 + 0.462745098039,
  //   Math.random() * 0.21568627451 + 0.462745098039,
  // ).getStyle()
  // element.textContent = "text!"

  // var domObject = new CSS3DObject(element)
  // domObject.position.x = Math.random() * 200 - 100
  // domObject.position.y = Math.random() * 200 - 100
  // domObject.position.z = Math.random() * 200 - 100
  // cssScene.add(domObject)
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
  // let renderer2: CSS3DRenderer | null = null

  // let cssScene = new Scene()

  // configuration of the custom layer for a 3D model per the CustomLayerInterface
  const featureLayer: mapboxgl.AnyLayer = {
    id: id,
    type: "custom",
    renderingMode: "3d",

    onAdd: (map, gl) => {
      addLightToScene(1, 0, 1, baseScene)
      addLightToScene(-1, 0, 1 - 1, baseScene)
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

      // renderer2 = new CSS3DRenderer()
      // renderer2.setSize(window.innerWidth, window.innerHeight)
      // renderer2.domElement.style.position = "absolute"
      // renderer2.domElement.style.top = "0"
      // map.getCanvas().appendChild(renderer2.domElement)
    },

    render: (_gl, matrix) => {
      camera.projectionMatrix = new Matrix4().fromArray(matrix).multiply(sceneTransform.matrix)
      renderer?.state.reset()
      renderer?.render(baseScene, camera)
      // renderer2?.render(cssScene, camera)
      map.triggerRepaint()
    },
  }

  return featureLayer
}
