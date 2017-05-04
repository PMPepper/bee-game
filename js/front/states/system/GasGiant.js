import {SubStellarBody} from './SubStellarBody';

export class GasGiant extends SubStellarBody {
  constructor (name, mass, radius, day, axialTilt, tidalLock, parent, minerals, colonies) {
    super(name, mass, radius, day, axialTilt, tidalLock, parent, -1, minerals, colonies, -1, -1, -1, -1, -1, -1, -1, -1);

    this._freeze(GasGiant);
  }


  get type () {
    return 'gas giant';
  }

}
