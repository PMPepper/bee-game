import {SystemBody} from './SystemBody';

export class SubStellarBody extends SystemBody {
  constructor (name, mass, radius, parent, albedo, minerals, colonies, surfaceTemp, minSurfaceHeating, maxSurfaceHeating, avgSurfaceHeating, minSurfaceTemp, maxSurfaceTemp, avgSurfaceTemp) {
    super(name, mass, radius, parent, orbit);

    this._albedo = albedo;
    this._minerals = minerals || null;
    this._colonies = colonies ? colonies.slice() : [];
    this._surfaceTemp = surfaceTemp;
    this._minSurfaceHeating = minSurfaceHeating;
    this._maxSurfaceHeating = maxSurfaceHeating;
    this._avgSurfaceHeating = avgSurfaceHeating;
    this._minSurfaceTemp = minSurfaceTemp;
    this._maxSurfaceTemp = maxSurfaceTemp;
    this._avgSurfaceTemp = avgSurfaceTemp;

    if(new.target == SubStellarBody) {
      throw new Error('SubStellarBody is in abstract class and should never be instanciated directly');
    }
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

  get surfaceTemp () {
    return this._surfaceTemp;
  }

  get minSurfaceHeating () {
    return this._minSurfaceHeating;
  }

  get maxSurfaceHeating () {
    return this._maxSurfaceHeating;
  }

  get avgSurfaceHeating () {
    return this._avgSurfaceHeating;
  }

  get minSurfaceTemp () {
    return this._minSurfaceTemp;
  }

  get maxSurfaceTemp () {
    return this._maxSurfaceTemp;
  }

  get avgSurfaceTemp () {
    return this._avgSurfaceTemp;
  }

}
