import { createEngine, createScene, createPBRSkybox, createArcRotateCamera } from './runtime'
import '@babylonjs/loaders/glTF/2.0'
import '@babylonjs/core/Misc/dds'
import '@babylonjs/core/Materials/Textures/Loaders/envTextureLoader'

import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'

import './style.css'

const canvas: HTMLCanvasElement = document.getElementById('app') as HTMLCanvasElement
const engine = createEngine(canvas)
const scene = createScene()

createPBRSkybox()
createArcRotateCamera()

function createLights() {
  const light = new HemisphericLight('light', Vector3.Zero(), scene)
  light.intensity = 0.3
}

async function loadBabylonCube() {
  await SceneLoader.ImportMeshAsync('', '/models/', 'babylon-cube.glb', scene)
}

/**
 * Main function that is run on startup
 */
async function main() {
  createLights()
  await loadBabylonCube()

  // Start the scene
  engine.runRenderLoop(() => {
    scene.render()
  })
}

main().catch((error) => console.error(error))
