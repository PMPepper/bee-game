import {Model} from '../Model';

export class KnownSystem extends Model {
  constructor (system, name, knownJumpPoints) {
    super();

    this._system = system;
    this._name = name;
    this._knownJumpPoints = knownJumpPoints;//TODO
  }

  get system () {
    return this._system;
  }

  get name () {
    return this._name;
  }

  get knownJumpPoints () {
    return this._knownJumpPoints;
  }

  getState () {
    return this._state({
      systemId: Model.id(this.system),
      name:this.name,
      knownJumpPoints: null //TODO
    });
  }
}
