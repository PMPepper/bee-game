export class KnownSystem {
  constructor(id, system, name, discoveryDate, knownJumpPoints) {
    this._id = id;
    this._system = system;
    this._name = name;
    this._discoveryDate = discoveryDate;
    this._knownJumpPoints = knownJumpPoints;
  }

  get id() {
    return this._id;
  }

  get system() {
    return this._system;
  }

  get name() {
    return this._name;
  }

  get discoveryDate() {
    return this._discoveryDate;
  }

  get knownJumpPoints() {
    return this._knownJumpPoints;
  }
}
