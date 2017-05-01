import {SubStellarBody} from './SubStellarBody';

export class GasGiant extends SubStellarBody {
  constructor (name, mass, radius, parent, minerals, colonies) {
    super(name, mass, radius, parent, -1, minerals, colonies);

    this._freeze(GasGiant);
  }


  get type () {
    return 'gas giant';
  }

}
