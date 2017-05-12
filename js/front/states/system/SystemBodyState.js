export class SystemBodyState {
  constructor(id, body, position, orbit) {
    this._id = id;
    this._body = body;
    this._position = position;
    this._orbit = orbit;
    this._system = null;
  }

  get id() {
    return this._id;
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
