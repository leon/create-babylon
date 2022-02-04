import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Engine } from '@babylonjs/core/Engines/engine'
import { ImageProcessingConfiguration } from '@babylonjs/core/Materials/imageProcessingConfiguration'
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture'
import { Color4 } from '@babylonjs/core/Maths/math.color'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Scene } from '@babylonjs/core/scene'
import '@babylonjs/core/Helpers/sceneHelpers' // needed to augment scene with createDefaultSkybox
import '@babylonjs/core/Collisions/collisionCoordinator' // needed so camera can collide with meshes

export let canvas: HTMLCanvasElement
export let engine: Engine
export let scene: Scene
export let camera: ArcRotateCamera

export const createEngine = (hostCanvas: HTMLCanvasElement) => {
  canvas = hostCanvas
  engine = new Engine(canvas, true, {}, true)

  const handleResize = () => engine.resize()
  window.addEventListener('resize', handleResize)
  window.addEventListener('unload', () => window.removeEventListener('resize', handleResize), {
    once: true,
  })

  return engine
}

export const createScene = () => {
  scene = new Scene(engine)

  // change to a neutral color instead of babylon purple default
  scene.clearColor = new Color4(0.8, 0.8, 0.8, 1)

  // optimize scene for opaque background
  scene.autoClear = false
  scene.autoClearDepthAndStencil = false

  // setup ACES tone mapping for more natural colors
  scene.imageProcessingConfiguration.toneMappingEnabled = true
  scene.imageProcessingConfiguration.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES

  // show the inspector when pressing shift + alt + I
  // install @babylonjs/inspector and import here
  // scene.onKeyboardObservable.add(({ event }) => {
  //   if (event.ctrlKey && event.shiftKey && event.code === 'KeyI') {
  //     if (scene.debugLayer.isVisible()) {
  //       scene.debugLayer.hide()
  //     } else {
  //       scene.debugLayer.show()
  //     }
  //   }
  // })

  return scene
}

export const createArcRotateCamera = () => {
  const startAlpha = (Math.PI / 4) * 3 // horizontal rotation
  const startBeta = Math.PI / 4 // vertical angle
  const startRadius = 5 // how far from center
  const startPosition = new Vector3(0, 0, 0)
  const camera = new ArcRotateCamera(
    'camera',
    startAlpha,
    startBeta,
    startRadius,
    startPosition,
    scene,
    true,
  )
  camera.attachControl(canvas, false)

  // Set some basic camera settings
  camera.minZ = 1 // clip at 1 meter

  camera.panningAxis = new Vector3(1, 0, 1) // pan along ground
  camera.panningSensibility = 1000 // how fast do you pan, set to 0 if you don't want to allow panning
  camera.panningOriginTarget = Vector3.Zero() // where does the panning distance limit originate from
  camera.panningDistanceLimit = 100 // how far can you pan from the origin

  camera.allowUpsideDown = false // don't allow zooming inverted
  camera.lowerRadiusLimit = 2 // how close can you zoom
  camera.upperRadiusLimit = 100 // how far out can you zoom
  camera.lowerBetaLimit = 0.5 // how high can you move the camera
  camera.upperBetaLimit = 1.4 // how low down can you move the camera

  camera.checkCollisions = true // make the camera collide with meshes
  camera.collisionRadius = new Vector3(1, 1, 1) // how close can the camera go to other meshes

  camera.useAutoRotationBehavior = true // rotate around the target

  return camera
}

export const createPBRSkybox = () => {
  const environmentTexture = CubeTexture.CreateFromPrefilteredData(
    '/environments/environment-specular.env',
    scene,
  )
  return scene.createDefaultSkybox(environmentTexture, true, 150, 0.5, true)
}
