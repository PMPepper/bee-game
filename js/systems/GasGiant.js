import {SubStellarBody} from './SubStellarBody';

export class GasGiant extends MineableBody {
  constructor (name, mass, radius, parent, orbitRadius, orbitOffset, albedo, minerals, colonies) {
    super(name, mass, radius, parent, orbitRadius, orbitOffset, albedo, minerals, colonies);
  }


  get type () {
    return 'gas giant';
  }

}
