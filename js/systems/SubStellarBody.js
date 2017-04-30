import {SystemBody} from './SystemBody';

export class SubStellarBody extends SystemBody {
  constructor (name, mass, radius, parent, orbitRadius, orbitOffset, albedo, minerals, colonies) {
    super(name, mass, radius, parent, orbitRadius, orbitOffset);

    this._albedo = albedo;
    this._minerals = minerals || null;
    this._colonies = colonies ? colonies.slice() : [];
  }

  get albedo () {
    return this._albedo;
  }

  get minerals() {
    return this._minerals;
  }

  get colonies () {
    return this._colonies;
  }

  getColony(faction) {
    //TODO
    return null;
  }

}
