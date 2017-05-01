import {Orbit} from './Orbit';

export class OrbitRegular extends Orbit {
  constructor(period, radius, angle) {
    super(period, radius, angle, radius, radius);

    this._freeze(OrbitRegular);
  }
}
