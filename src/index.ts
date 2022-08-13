import { Renderer, Object3D, Camera, Geometry, Material, Mesh } from './four'
import { quat } from 'gl-matrix'

const renderer = new Renderer()
document.body.appendChild(renderer.canvas)

const scene = new Object3D()

const camera = new Camera()
camera.position[2] = 5
scene.add(camera)

const geometry = new Geometry({
  normal: {
    size: 3,
    data: new Float32Array([
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    ]),
  },
  position: {
    size: 3,
    data: new Float32Array([
      0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5,
      -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
      -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
      0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
    ]),
  },
  index: {
    size: 1,
    data: new Uint32Array([
      0, 2, 1, 2, 3, 1, 4, 6, 5, 6, 7, 5, 8, 10, 9, 10, 11, 9, 12, 14, 13, 14, 15, 13, 16, 18, 17, 18, 19, 17, 20, 22,
      21, 22, 23, 21,
    ]),
  },
})

const material = new Material({
  uniforms: {
    color: [1, 0.4, 0.7],
  },
  vertex: /* glsl */ `#version 300 es
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat3 normalMatrix;
    uniform vec3 color;

    in vec3 position;
    in vec3 normal;
    out vec3 vNormal;
    out vec3 vColor;

    void main() {
      vNormal = normalMatrix * normal;
      vColor = color;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `#version 300 es
    precision highp float;

    in vec3 vNormal;
    in vec3 vColor;
    out vec4 pc_fragColor;

    void main() {
      float lighting = dot(vNormal, normalize(vec3(10)));
      pc_fragColor = vec4(vColor + lighting * 0.1, 1.0);
    }
  `,
})

const cube = new Mesh(geometry, material)
scene.add(cube)

function handleResize(): void {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
}
window.addEventListener('resize', handleResize)
handleResize()

function animate(time: DOMHighResTimeStamp): void {
  requestAnimationFrame(animate)
  quat.fromEuler(cube.quaternion, 0, time / 20, time / 20)
  renderer.render(scene, camera)
}
requestAnimationFrame(animate)
