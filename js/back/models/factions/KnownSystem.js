import {Model} from '../Model';

export class KnownSystem extends Model {
  constructor (system, name, discoveryDate, knownJumpPoints) {
    super();

    this._system = system;
    this._name = name;
    this._discoveryDate = discoveryDate;
    this._knownJumpPoints = knownJumpPoints;//TODO
  }

  get system () {
    return this._system;
  }

  get name () {
    return this._name;
  }

  get discoveryDate() {
    return this._discoveryDate;
  }

  get knownJumpPoints () {
    return this._knownJumpPoints;
  }

  getState () {
    return this._state({
      systemId: Model.id(this.system),
      name:this.name,
      discoveryDate: this.discoveryDate,
      knownJumpPoints: null //TODO
    });
  }
}
