import {State} from '../State';

export class SystemBodyState extends State {
  constructor(id, body, position, orbit) {
    super(id);

    this._body = body;
    this._position = position;
    this._orbit = orbit;
    this._system = null;
  }

  get body() {
    return this._body;
  }

  get system() {
    return this._system;
  }

  get position() {
    return this._position;
  }

  get orbit() {
    return this._orbit;
  }
}
