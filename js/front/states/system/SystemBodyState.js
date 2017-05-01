import {Immutable} from '../../../core/Immutable';

export class SystemBodyState extends Immutable {
  constructor(body, position, orbit) {
    super();
    
    this._body = body;
    this._position = position;
    this._orbit = orbit;

    this._freeze(SystemBodyState);
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
}
