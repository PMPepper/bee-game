import {Constants} from '../../../core/Constants';
import {Immutable} from '../../../core/Immutable';

export class SystemBody extends Immutable {
  constructor (name, mass, radius, day, axialTilt, tidalLock, parent) {
    super();

    this._name = name;
    this._mass = mass;
    this._radius = radius;
    this._day = day;
    this._axialTilt = axialTilt;
    this._tidalLock = tidalLock;
    this._parent = parent || null;
    this._system = null;

    //calculated props
    this._volume = (4/3)*Math.PI*Math.pow( this.radius, 3);
    this._surfaceGravity = (Constants.GRAVITATIONAL_CONSTANT * this.mass) / (this.radius * this.radius);
    this._escapeVelocity =  Math.sqrt((2*Constants.GRAVITATIONAL_CONSTANT*this.mass)/this.radius);


    if(new.target == SystemBody) {
      throw new Error('SystemBody is in abstract class and should never be instanciated directly');
    }
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get mass () {
    return this._mass;
  }

  get radius () {
    return this._radius;
  }

  get day () {
    return this._day;
  }

  get axialTilt () {
    return this._axialTilt;
  }

  get tidalLock () {
    return this._tidalLock;
  }

  get diameter () {
    return this.radius * 2;
  }

  get density () {
    return this.mass / this.density;
  }

  get volume () {
    return this._volume;
  }

  get surfaceGravity () {
    return this._surfaceGravity;
  }

  get escapeVelocity () {
    return this._escapeVelocity;
  }

  get parent () {
    return this._parent;
  }

  get system () {
    return this._system;
  }

  get type () {
    throw new Error('Not implemented');
  }
}
