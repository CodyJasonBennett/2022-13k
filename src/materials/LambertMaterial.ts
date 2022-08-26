import { Material } from '../four'

export class LambertMaterial extends Material {
  constructor(color = [1, 1, 1]) {
    super({
      vertex: /* glsl */ `#version 300 es
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform mat3 normalMatrix;
        in vec3 normal;
        in mat4 instanceMatrix;
        in vec3 position;
        out vec3 vNormal;

        void main() {
          vNormal = normalMatrix * normal;
          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        }
      `,
      fragment: /* glsl */ `#version 300 es
        precision highp float;

        in vec3 vNormal;
        out vec4 pc_fragColor;

        void main() {
          float lighting = dot(vNormal, normalize(vec3(0, 10, -10)));
          pc_fragColor = vec4(${color} + lighting * 0.1, 1.0);
        }
      `,
    })
  }
}
