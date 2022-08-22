import { Material } from '../four'

export class WireMaterial extends Material {
  constructor(color = [1, 1, 1], thickness = 0.03) {
    super({
      vertex: /* glsl */ `#version 300 es
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        in vec3 position;
        out vec3 vBarycentric;

        const vec3 barycentric[3] = vec3[3](vec3(0, 1, 0), vec3(0, 0, 1), vec3(1, 0, 0));

        void main() {
          vBarycentric = barycentric[(gl_VertexID + 1) % 3];
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: /* glsl */ `#version 300 es
        precision highp float;

        in vec3 vBarycentric;
        out vec4 pc_fragColor;

        void main() {
          vec3 smooth_dist = smoothstep(vec3(0.0), fwidth(vBarycentric) * 5.5, vBarycentric);
          float line = min(min(smooth_dist.x, smooth_dist.y), smooth_dist.z);

          float edge = 1.0 - smoothstep(${thickness} - fwidth(line), ${thickness} + fwidth(line), line);
          pc_fragColor = vec4(${color}, edge);
        }
      `,
      side: 'both',
      transparent: true,
      depthWrite: false,
    })
  }
}
