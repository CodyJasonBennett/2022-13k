import { vec3 } from 'gl-matrix'
import { Renderer, Camera, Object3D, Mesh } from './four'
import { Stars } from './objects/Stars'
import { ShipGeometry } from './geometry/ShipGeometry'
import { BoxGeometry } from './geometry/BoxGeometry'
import { OutlineMaterial } from './materials/OutlineMaterial'
import { OrbitControls } from './controls/OrbitControls'

const renderer = new Renderer()
document.body.appendChild(renderer.canvas)

const camera = new Camera(45, 1, 0.01, 20000)
camera.position[2] = 5

const scene = new Object3D()

const stars = new Stars()
scene.add(stars)

const ground = new Mesh(new BoxGeometry(), new OutlineMaterial())
vec3.set(ground.scale, 15, Number.EPSILON, 15)
vec3.set(ground.position, 0, -1, 0)
scene.add(ground)

const tower = new Mesh(new BoxGeometry(), new OutlineMaterial())
vec3.set(tower.scale, 2, 10, 2)
vec3.set(tower.position, -10, 4, -10)
scene.add(tower)

const player = new Mesh(new ShipGeometry(), new OutlineMaterial())
scene.add(player)

const controls = new OrbitControls(camera)
controls.connect(renderer.canvas)

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
