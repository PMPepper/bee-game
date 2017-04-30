import {Planet} from './Planet';

export class DwarfPlanet extends Planet {
  constructor (name, mass, parent, orbitRadius, orbitOffset, minerals) {
    super(name, mass, parent, orbitRadius, orbitOffset, minerals);
  }
}
