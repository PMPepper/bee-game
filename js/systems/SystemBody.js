import {Coord} from '../Coord';
import {Constants} from '../Constants';
import {Circle} from '../graphics/Circle';

export class SystemBody {
  constructor (name, mass, parent, orbitRadius, orbitOffset) {
    this._name = name;
    this._mass = mass;
    this._parent = parent || null;
    this._orbitRadius = orbitRadius;
    this._orbitOffset = orbitOffset;
  }

  get name () {
    return this._name;
  }

  get mass () {
    return this._mass;
  }

  get parent () {
    return this._parent;
  }

  get orbitRadius () {
    return this._orbitRadius;
  }

  get orbitOffset () {
    return this._orbitOffset;
  }

  get system () {
    return this._system;
  }

  get orbitalPeriod () {
    const parent = this.parent;

    if(!parent) {
      return null;
    }

    const a = Math.pow(this.orbitRadius, 3);
    const b = Constants.GRAVITATIONAL_CONSTANT * parent.mass;

    const period = 2 * Math.PI * Math.sqrt(a/b);

    return period;
  }

  getOrbitAngle (time) {
    const orbitalPeriod = this.orbitalPeriod;

    time += orbitalPeriod * this.orbitOffset;

    const orbitFraction = (time % orbitalPeriod)/orbitalPeriod;

    return orbitFraction * Math.PI * 2;
  }

  getPosition (time) {
    if(!this.parent) {
      return Coord.ORIGIN;
    }

    const orbitRadius = this.orbitRadius;
    const parentCoord = this.parent.getPosition(time);
    const orbitAngle = this.getOrbitAngle(time);

    return new Coord(parentCoord.x + (orbitRadius * Math.cos(orbitAngle)), parentCoord.y + (orbitRadius * Math.sin(orbitAngle)));
  }

  //render details
  get renderStyle () {
    return basicCircle;
  }
}

const basicCircle = new Circle(2, 0xFFFF0000);
