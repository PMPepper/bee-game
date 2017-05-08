import {SubStellarBody} from './SubStellarBody';

export class GasGiant extends SubStellarBody {
  constructor (id, name, mass, radius, day, axialTilt, tidalLock, parent, minerals, colonies) {
    super(id, name, mass, radius, day, axialTilt, tidalLock, parent, -1, minerals, colonies, -1, -1, -1, -1, -1, -1, -1, -1);
  }


  get type () {
    return 'gas giant';
  }

}
