import {SubStellarBody} from './SubStellarBody';

export class GasGiant extends SubStellarBody {
  constructor (name, mass, radius, parent, orbit, minerals, colonies) {
    super(name, mass, radius, parent, orbit, -1, minerals, colonies);
  }


  get type () {
    return 'gas giant';
  }

}
