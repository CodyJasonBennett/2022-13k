import { Mesh } from '../four'
import { BoxGeometry } from '../geometry/BoxGeometry'
import { WireMaterial } from '../materials/WireMaterial'

export class Cube extends Mesh {
  constructor(color?: [number, number, number], thickness?: number) {
    super(new BoxGeometry(), new WireMaterial(color, thickness))
  }
}
