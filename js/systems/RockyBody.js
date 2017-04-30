import {MineableBody} from './MineableBody';

export class RockyBody extends MineableBody {
  constructor (name, mass, parent, orbitRadius, orbitOffset, minerals) {
    super(name, mass, parent, orbitRadius, orbitOffset, minerals);
  }

}
