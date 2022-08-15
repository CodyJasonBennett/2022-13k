import { Material } from '../four'

export class WireMaterial extends Material {
  constructor(color = [1, 1, 1], thickness = 0.03) {
    super({
      uniforms: { color, thickness },
      vertex: /* glsl */ `#version 300 es
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        in vec3 barycentric;
        in vec3 position;
        out vec3 vBarycentric;

        void main() {
          vBarycentric = barycentric;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: /* glsl */ `#version 300 es
        precision highp float;

        uniform vec3 color;
        uniform float thickness;
        in vec3 vBarycentric;
        out vec4 pc_fragColor;

        void main() {
          float line = min(min(vBarycentric.x, vBarycentric.y), vBarycentric.z);
          float edge = 1.0 - smoothstep(thickness - fwidth(line), thickness + fwidth(line), line);
          pc_fragColor = vec4(color, edge + 0.08);
        }
      `,
      side: 'both',
      transparent: true,
      depthWrite: false,
    })
  }
}
