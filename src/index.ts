import { Renderer, Camera, Object3D, Mesh } from './four'
import { Stars } from './objects/Stars'
import { PlayerControls } from './controls/PlayerControls'
import { ShipGeometry } from './geometry/ShipGeometry'
import { WireMaterial } from './materials/WireMaterial'

const renderer = new Renderer()
document.body.appendChild(renderer.canvas)

const camera = new Camera(45, 1, 0.01, 20000)
camera.position[2] = 5

const scene = new Object3D()

const stars = new Stars()
scene.add(stars)

const player = new Mesh(new ShipGeometry(), new WireMaterial())
scene.add(player)

const controls = new PlayerControls(player, camera)
controls.connect()

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
