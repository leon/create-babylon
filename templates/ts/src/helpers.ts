import { BackgroundMaterial } from '@babylonjs/core/Materials/Background/backgroundMaterial'
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder'
import { Scene } from '@babylonjs/core/scene'

import '@babylonjs/core/Materials/Textures/Loaders/envTextureLoader' // needed for environment texture
import '@babylonjs/core/Misc/dds' // needed for environment texture

export function createEnvironment(scene: Scene) {
  const environmentTexture = CubeTexture.CreateFromPrefilteredData('/environments/environment-specular.env', scene)
  scene.environmentTexture = environmentTexture

  const skyBox = CreateBox('skyBox', { size: 1000 }, scene)
  skyBox.isPickable = false
  skyBox.infiniteDistance = true
  skyBox.ignoreCameraMaxZ = true
  const skyBoxMaterial = new BackgroundMaterial('skyBoxMaterial', scene)
  skyBox.material = skyBoxMaterial
  skyBoxMaterial.reflectionTexture = environmentTexture.clone()
  skyBoxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE
  skyBoxMaterial.backFaceCulling = false
  skyBoxMaterial.reflectionBlur = 0.5
  skyBoxMaterial.opacityFresnel = false
}
