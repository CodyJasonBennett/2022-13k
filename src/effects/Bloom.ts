import { Mesh, RenderTarget, Material, Renderer, Object3D, Camera } from '../four'
import { TriangleGeometry } from '../geometry/TriangleGeometry'

export class Bloom extends Mesh {
  readonly screen = new RenderTarget(0, 0)

  constructor(threshold = 0.4, distance = 0.01, iterations = 32) {
    const geometry = new TriangleGeometry()
    const material = new Material({
      uniforms: {
        threshold,
        distance,
        iterations,
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
    })

    super(geometry, material)
    this.material.uniforms.screen = this.screen.textures[0]
  }

  setSize(width: number, height: number): void {
    this.screen.setSize(width, height)
  }

  render(renderer: Renderer, scene: Object3D, camera: Camera): void {
    renderer.setRenderTarget(this.screen)
    renderer.render(scene, camera)
    renderer.setRenderTarget(null)
    renderer.render(this)
  }
}
