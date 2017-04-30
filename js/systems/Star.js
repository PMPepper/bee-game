import {SystemBody} from './SystemBody';

export class Star extends SystemBody {
  constructor (name, mass, parent, orbitRadius, orbitOffset) {
    super(name, mass, parent, orbitRadius, orbitOffset);
  }
}
