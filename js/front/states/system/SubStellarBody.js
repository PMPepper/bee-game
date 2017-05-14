import {SystemBody} from './SystemBody';

export class SubStellarBody extends SystemBody {
  constructor (name, mass, radius, day, axialTilt, tidalLock, parent, albedo, minerals, colonies, surfaceHeating, minSurfaceHeating, maxSurfaceHeating, avgSurfaceHeating, surfaceTemp, minSurfaceTemp, maxSurfaceTemp, avgSurfaceTemp) {
    super(name, mass, radius, day, axialTilt, tidalLock, parent);

    this._albedo = albedo;
    this._minerals = minerals || null;
    this._colonies = colonies ? colonies.slice() : [];
    this._surfaceHeating = surfaceHeating;
    this._minSurfaceHeating = minSurfaceHeating;
    this._maxSurfaceHeating = maxSurfaceHeating;
    this._avgSurfaceHeating = avgSurfaceHeating;
    this._surfaceTemp = surfaceTemp;
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

  get surfaceHeating () {
    return this._surfaceHeating;
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

  get surfaceTemp () {
    return this._surfaceTemp;
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
