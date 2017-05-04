import {Model} from '../Model';

export class KnownSystem extends Model {
  constructor (id, system, name, knownJumpPoints) {
    super(id);

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
      system: this.system.id,
      name:this.name,
      knownJumpPoints: null //TODO
    });
  }
}
