import { Renderer, Camera, Object3D, Mesh } from './four'
import { Stars } from './objects/Stars'
import { ShipGeometry } from './geometry/ShipGeometry'
import { OutlineMaterial } from './materials/OutlineMaterial'
import { OrbitControls } from './controls/OrbitControls'
import { PlayerControls } from './controls/PlayerControls'

const renderer = new Renderer()
document.body.appendChild(renderer.canvas)

const camera = new Camera(45, 1, 0.01, 20000)
camera.position[2] = 5

const scene = new Object3D()

const stars = new Stars()
scene.add(stars)

const dummy = new Object3D()
const matrices: number[] = []

dummy.position[0] = -1.5
dummy.updateMatrix()
matrices.push(...Array.from(dummy.matrix))

dummy.position[0] = 1.5
dummy.updateMatrix()
matrices.push(...Array.from(dummy.matrix))

const player = new Mesh(new ShipGeometry(), new OutlineMaterial())
player.instances = matrices.length / 16
player.geometry.attributes.instanceMatrix = { size: 16, divisor: 1, data: new Float32Array(matrices) }
scene.add(player)

// @ts-expect-error
if (process.env.NODE_ENV === 'development' && window.location.hash === '#debug') {
  const controls = new OrbitControls(camera)
  controls.connect(renderer.canvas)
} else {
  const controls = new PlayerControls(player, camera)
  controls.connect()
}

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
