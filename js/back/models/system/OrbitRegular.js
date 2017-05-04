import {Orbit} from './Orbit';
import {Constants} from '../../../core/Constants';
import {Coord} from '../../../core/Coord';

export class OrbitRegular extends Orbit {
  constructor(id, radius, offset) {
    super(id);

    this._radius = radius;
    this._offset = offset;
  }

  getState() {
    return this._state({
      period:this.period,
      angle:123,
      radius:this.radius
    });
  }

  get radius() {
    return this._radius;
  }

  get minRadius() {
    return this.radius;
  }

  get maxRadius() {
    return this.radius;
  }

  get offset() {
    return this._offset;
  }

  get period () {
    const parent = this.body.parent;

    if(!parent) {
      return null;
    }

    const a = Math.pow(this.radius, 3);
    const b = Constants.GRAVITATIONAL_CONSTANT * parent.mass;

    const period = 2 * Math.PI * Math.sqrt(a/b);

    return period;
  }

  getAngle (time) {
    const orbitalPeriod = this.period;

    time += orbitalPeriod * this.offset;

    const orbitFraction = (time % orbitalPeriod)/orbitalPeriod;

    return orbitFraction * Math.PI * 2;
  }

  getPosition (time) {
    const parent = this.body.parent;

    if(!parent) {
      return Coord.ORIGIN;
    }

    const orbitRadius = this.radius;
    const parentCoord = parent.getPosition(time);
    const orbitAngle = this.getAngle(time);

    return new Coord(parentCoord.x + (orbitRadius * Math.cos(orbitAngle)), parentCoord.y + (orbitRadius * Math.sin(orbitAngle)));
  }
}
