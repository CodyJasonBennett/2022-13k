import { Geometry } from '../four'

export class TriangleGeometry extends Geometry {
  constructor() {
    super({
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    })
  }
}
