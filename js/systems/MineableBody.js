import {SystemBody} from './SystemBody';

export class MineableBody extends SystemBody {
  constructor (name, mass, parent, orbitRadius, orbitOffset, minerals) {
    super(name, mass, parent, orbitRadius, orbitOffset);

    this._minerals = minerals;
  }

  get minerals() {
    return this._minerals;
  }

}
