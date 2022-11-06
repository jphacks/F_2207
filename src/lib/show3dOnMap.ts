import { Map, MercatorCoordinate } from "mapbox-gl"
import { DirectionalLight, WebGLRenderer, Matrix4, Vector3, Camera, Scene } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export const show3dOnMap = (map: Map, camera: Camera, scene: Scene) => {
  // parameters to ensure the model is georeferenced correctly on the map
  const modelOrigin = [135.6042317745411, 34.86210390210311] as [number, number]
  const modelAltitude = 0
  const modelRotate = [Math.PI / 2, 0, 0]

  const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude)

  // transformation parameters to position, rotate and scale the 3D model onto the map
  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    /* Since the 3D model is in real world meters, a scale transform needs to be
     * applied since the CustomLayerInterface expects units in MercatorCoordinates.
     */
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
  }

  // const camera = new Camera()
  let renderer: THREE.WebGLRenderer | null = null

  // configuration of the custom layer for a 3D model per the CustomLayerInterface
  const customLayer: mapboxgl.AnyLayer = {
    id: "3d-model",
    type: "custom",
    renderingMode: "3d",
    onAdd: function (map, gl) {
      // create two three.js lights to illuminate the model
      const directionalLight = new DirectionalLight(0xffffff)
      directionalLight.position.set(0, -70, 100).normalize()
      scene.add(directionalLight)

      const directionalLight2 = new DirectionalLight(0xffffff)
      directionalLight2.position.set(0, 70, 100).normalize()
      scene.add(directionalLight2)

      // use the three.js GLTF loader to add the 3D model to the three.js scene
      const loader = new GLTFLoader()
      loader.load("/models/capsule3.glb", (gltf) => {
        scene.add(gltf.scene)
      })

      // use the Mapbox GL JS map canvas for three.js
      renderer = new WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      })

      renderer!.autoClear = false
    },
    render: function (gl, matrix) {
      const rotationX = new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), modelTransform.rotateX)
      const rotationY = new Matrix4().makeRotationAxis(new Vector3(0, 1, 0), modelTransform.rotateY)
      const rotationZ = new Matrix4().makeRotationAxis(new Vector3(0, 0, 1), modelTransform.rotateZ)

      const m = new Matrix4().fromArray(matrix)
      const l = new Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ as number,
        )
        .scale(
          new Vector3(
            modelTransform.scale * 0.5,
            -modelTransform.scale * 0.5,
            modelTransform.scale * 0.5,
          ),
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ)

      camera.projectionMatrix = m.multiply(l)
      renderer?.resetState()
      renderer?.render(scene, camera)
      map.triggerRepaint()
    },
  }

  return customLayer
}
