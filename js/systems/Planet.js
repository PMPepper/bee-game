import {SubStellarBody} from './SubStellarBody';

export class Planet extends SubStellarBody {
  constructor (name, mass, radius, parent, orbitRadius, orbitOffset, albedo, minerals, colonies, atmosphere, type) {
    super(name, mass, radius, parent, orbitRadius, orbitOffset, albedo, minerals, colonies);

    this._atmosphere = atmosphere;
    this._type;
  }

  get atmosphere () {
    return this._atmosphere;
  }

  get type () {
    return this._type;
  }

}
