import { Mesh, Geometry, Material } from '../four'

const COUNT = 4000
const RADIUS = 5000
const SIZE = 40

export class Stars extends Mesh {
  constructor() {
    const position = new Float32Array(COUNT * 3)
    const size = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      const x = RADIUS * Math.sin(phi) * Math.cos(theta)
      const y = RADIUS * Math.sin(phi) * Math.sin(theta)
      const z = RADIUS * Math.cos(phi)
      position.set([x, y, z], i * 3)

      size[i] = SIZE + 2 * SIZE * Math.random()
    }

    const geometry = new Geometry({
      position: { size: 3, data: position },
      size: { size: 1, data: size },
    })

    const material = new Material({
      vertex: /* glsl */ `#version 300 es
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        in vec3 position;
        in float size;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);

          gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(mvPosition.x + 2.0 * size + 100.0 * size));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragment: /* glsl */ `#version 300 es
        out highp vec4 pc_fragColor;

        void main() {
          pc_fragColor = vec4(1);
        }
      `,
    })

    super(geometry, material)
    this.mode = 'POINTS'
  }
}
