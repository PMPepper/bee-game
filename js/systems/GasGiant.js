import {MineableBody} from './MineableBody';

export class GasGiant extends MineableBody {
  constructor (name, mass, parent, orbitRadius, orbitOffset, minerals) {
    super(name, mass, parent, orbitRadius, orbitOffset, minerals);
  }
}
