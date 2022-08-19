import { Renderer, Object3D, Camera, Mesh } from './four'
import { BoxGeometry } from './geometry/BoxGeometry'
import { WireMaterial } from './materials/WireMaterial'
import { PlayerControls } from './controls/PlayerControls'

const renderer = new Renderer()
document.body.appendChild(renderer.canvas)

const camera = new Camera()
camera.position[2] = 5

const scene = new Object3D()

const player = new Mesh(new BoxGeometry(), new WireMaterial())
scene.add(player)

const controls = new PlayerControls(player, camera)
controls.connect()

const pink = new Mesh(new BoxGeometry(), new WireMaterial([1.0, 0.3, 0.9]))
pink.position[0] = -1
scene.add(pink)

const green = new Mesh(new BoxGeometry(), new WireMaterial([0.2, 1.0, 0.6]))
green.position[0] = 0
scene.add(green)

const blue = new Mesh(new BoxGeometry(), new WireMaterial([0.5, 0.8, 1.0]))
blue.position[0] = 1
scene.add(blue)

function handleResize(): void {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
}
window.addEventListener('resize', handleResize)
handleResize()

function animate(): void {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
requestAnimationFrame(animate)
