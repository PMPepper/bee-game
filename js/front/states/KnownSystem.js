export class KnownSystem {
  constructor(id, knownSystemBodies, system, name, discoveryDate, knownJumpPoints) {
    this._id = id;
    this._knownSystemBodies = knownSystemBodies;
    this._system = system;
    this._name = name;
    this._discoveryDate = discoveryDate;
    this._knownJumpPoints = knownJumpPoints;
  }

  get id() {
    return this._id;
  }

  get knownSystemBodies() {
    return this._knownSystemBodies;
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

  addKnownSystemBody(knownSystemBody) {
    this._knownSystemBodies.push(knownSystemBody);

    knownSystemBody._system = this;
  }

  getKnownSystemBodyById(id) {
    for(let i = 0; i < this._knownSystemBodies.length; i++) {
      if(this._knownSystemBodies[i].id == id) {
        return this._knownSystemBodies[i];
      }
    }

    return null;
  }
}
