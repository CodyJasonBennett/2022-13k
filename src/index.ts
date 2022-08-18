import { Renderer, Object3D, Camera, Mesh, Material, RenderTarget } from './four'
import { BoxGeometry } from './geometry/BoxGeometry'
import { WireMaterial } from './materials/WireMaterial'
import { Controls } from './Controls'
import { TriangleGeometry } from './geometry/TriangleGeometry'

const renderer = new Renderer()
document.body.appendChild(renderer.canvas)

const scene = new Object3D()

const camera = new Camera()
camera.position[2] = 5

// @ts-expect-error
if (process.env.NODE_ENV === 'development') {
  const controls = new Controls(camera)
  controls.connect(renderer.canvas)
}

const pink = new Mesh(new BoxGeometry(), new WireMaterial([1.0, 0.3, 0.9]))
pink.position[0] = -1
scene.add(pink)

const green = new Mesh(new BoxGeometry(), new WireMaterial([0.2, 1.0, 0.6]))
green.position[0] = 0
scene.add(green)

const blue = new Mesh(new BoxGeometry(), new WireMaterial([0.5, 0.8, 1.0]))
blue.position[0] = 1
scene.add(blue)

const renderTarget = new RenderTarget(window.innerWidth, window.innerHeight)

const bloom = new Mesh(
  new TriangleGeometry(),
  new Material({
    uniforms: {
      threshold: 0.4,
      distance: 0.01,
      iterations: 32,
      screen: renderTarget.textures[0],
    },
    vertex: /* glsl */ `#version 300 es
      in vec2 uv;
      in vec3 position;
      out vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragment: /* glsl */ `#version 300 es
      precision highp float;

      uniform float threshold;
      uniform float distance;
      uniform float iterations;
      uniform sampler2D screen;
      in vec2 vUv;
      out vec4 pc_fragColor;

      vec4 filterPixels(sampler2D sampler, vec2 uv) {
        vec4 color = texture(sampler, uv);
        color *= step(threshold, color);
        return color;
      }

      void main() {
        vec4 bloom;
        for (float i = 0.0; i < iterations; i++) {
          float offset = distance / iterations * (i - iterations / 2.0);
          bloom += filterPixels(screen, vUv + vec2(0, offset));
          bloom += filterPixels(screen, vUv + vec2(offset, 0));
        }
        bloom /= iterations * 2.0;

        pc_fragColor = texture(screen, vUv) + bloom;
      }
    `,
  }),
)

function handleResize(): void {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  renderTarget.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', handleResize)
handleResize()

function animate(): void {
  requestAnimationFrame(animate)

  renderer.setRenderTarget(renderTarget)
  renderer.render(scene, camera)
  renderer.setRenderTarget(null)
  renderer.render(bloom)
}
requestAnimationFrame(animate)
