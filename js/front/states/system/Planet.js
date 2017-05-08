import {SubStellarBody} from './SubStellarBody';

export class Planet extends SubStellarBody {
  constructor (name, mass, radius, day, axialTilt, tidalLock, parent, albedo, minerals, colonies, surfaceHeating, minSurfaceHeating, maxSurfaceHeating, avgSurfaceHeating, surfaceTemp, minSurfaceTemp, maxSurfaceTemp, avgSurfaceTemp, atmosphere, type) {
    super(name, mass, radius, day, axialTilt, tidalLock, parent, albedo, minerals, colonies, surfaceHeating, minSurfaceHeating, maxSurfaceHeating, avgSurfaceHeating, surfaceTemp, minSurfaceTemp, maxSurfaceTemp, avgSurfaceTemp);

    this._atmosphere = atmosphere;
    this._type = type;
  }

  get atmosphere () {
    return this._atmosphere;
  }

  get type () {
    return this._type;
  }

}
