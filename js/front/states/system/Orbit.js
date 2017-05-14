import {State} from '../State';

export class Orbit extends State{
  constructor (id, period, radius, angle, minRadius, maxRadius) {
    super(id);

    this._period = period;
    this._radius = radius;
    this._angle = angle;
    this._minRadius = minRadius;
    this._maxRadius = maxRadius;

    if(new.target == Orbit) {
      throw new Error('Orbit is in abstract class and should never be instanciated directly');
    }
  }

  get period () {
    return this._period;
  }

  get radius () {
    return this._minRadius;
  }

  get angle () {
    return this._angle;
  }

  get minRadius () {
    return this._minRadius;
  }

  get maxRadius () {
    return this._maxRadius;
  }

  get type () {
    return this.constructor.name;
  }
}
