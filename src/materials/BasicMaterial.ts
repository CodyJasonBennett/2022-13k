import { Material } from '../four'

export class BasicMaterial extends Material {
  constructor(color = [1, 1, 1]) {
    super({
      vertex: /* glsl */ `#version 300 es
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        in vec3 position;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: /* glsl */ `#version 300 es
        precision highp float;

        out vec4 pc_fragColor;

        void main() {
          pc_fragColor = vec4(${color}, 1.0);
        }
      `,
    })
  }
}
