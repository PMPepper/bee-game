import {SubStellarBody} from './SubStellarBody';

export class Planet extends SubStellarBody {
  constructor (name, mass, radius, parent, albedo, minerals, colonies, atmosphere, type) {
    super(name, mass, radius, parent, albedo, minerals, colonies);

    this._atmosphere = atmosphere;
    this._type = type;

    this._freeze(Planet);
  }

  get atmosphere () {
    return this._atmosphere;
  }

  get type () {
    return this._type;
  }

}
