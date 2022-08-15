import { Renderer, Object3D, Camera, Mesh } from './four'
import { BoxGeometry } from './geometry/BoxGeometry'
import { WireMaterial } from './materials/WireMaterial'

const renderer = new Renderer()
document.body.appendChild(renderer.canvas)

const scene = new Object3D()

const camera = new Camera()
camera.position[2] = 5
scene.add(camera)

const pink = new Mesh(new BoxGeometry(), new WireMaterial([1.0, 0.3, 0.9]))
pink.position[0] = -1
scene.add(pink)

const blue = new Mesh(new BoxGeometry(), new WireMaterial([0.5, 0.8, 1.0]))
blue.position[0] = 1
scene.add(blue)

const green = new Mesh(new BoxGeometry(), new WireMaterial([0.2, 1.0, 0.6]))
green.position[0] = 0
scene.add(green)

function handleResize(): void {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  renderer.render(scene, camera)
}
window.addEventListener('resize', handleResize)
handleResize()
