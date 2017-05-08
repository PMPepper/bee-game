import {Orbit} from './Orbit';

export class OrbitRegular extends Orbit {
  constructor(id, period, radius, angle) {
    super(id, period, radius, angle, radius, radius);
  }
}
