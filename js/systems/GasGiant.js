import {SubStellarBody} from './SubStellarBody';

export class GasGiant extends MineableBody {
  constructor (name, mass, radius, parent, orbit, albedo, minerals, colonies) {
    super(name, mass, radius, parent, orbit, albedo, minerals, colonies);
  }


  get type () {
    return 'gas giant';
  }

}
