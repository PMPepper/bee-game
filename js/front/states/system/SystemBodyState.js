import {Immutable} from '../../../core/Immutable';
import {SubStellarBody} from './SubStellarBody';

export class SystemBodyState extends Immutable {
  constructor(id, body, position, orbit) {
    super();

    this._id = id;
    this._body = body;
    this._position = position;
    this._orbit = orbit;

    this._freeze(SystemBodyState);
  }

  get id() {
    return this._id;
  }

  get body() {
    return this._body;
  }

  get position() {
    return this._position;
  }

  get orbit() {
    return this._orbit;
  }

  get isColonisable() {
    return this.body instanceof SubStellarBody
  }
}
