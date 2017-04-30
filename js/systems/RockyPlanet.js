import {RockyBody} from './RockyBody';

export class RockyPlanet extends RockyBody {
  constructor (name, mass, parent, orbitRadius, orbitOffset, minerals) {
    super(name, mass, parent, orbitRadius, orbitOffset, minerals);
  }
}
