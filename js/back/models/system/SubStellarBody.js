import {SystemBody} from './SystemBody';
import {Coord} from '../../../core/Coord';

export class SubStellarBody extends SystemBody {
  constructor (mass, radius, day, axialTilt, tidalLock, parent, orbit, albedo, minerals, colonies) {
    super(mass, radius, day, axialTilt, tidalLock, parent, orbit);

    this._albedo = albedo;
    this._minerals = minerals || null;
    this._colonies = colonies ? colonies.slice() : [];

    this._bodyState.albedo = albedo;

  }

  //called once system is created and all body info available
  setSystem(system) {
    super.setSystem(system);

    this._bodyState.minSurfaceHeating = this.minSurfaceHeating;
    this._bodyState.maxSurfaceHeating = this.maxSurfaceHeating;
    this._bodyState.avgSurfaceHeating = this.avgSurfaceHeating;

    this._bodyState.minSurfaceTemp = this.minSurfaceTemp;
    this._bodyState.maxSurfaceTemp = this.maxSurfaceTemp;
    this._bodyState.avgSurfaceTemp = this.avgSurfaceTemp;

  }

  update(newTime, events) {
    const lastTime = this.time;

    super.update(newTime, events);

    //update variable system body state
    this._bodyState.surfaceHeating = this.surfaceHeating;
    this._bodyState.surfaceTemp = this.surfaceTemp;

    //TODO update colonies, minerals, etc
  }

  get albedo () {
    return this._albedo;
  }

  get minerals() {
    return this._minerals;
  }

  set minerals(value) {
    if(!this._minerals) {//can only set minerals if no current minerals
      this._minerals = value;
    }
  }

  get colonies () {
    return this._colonies;
  }

  getColony(faction) {
    throw new Error('TODO Not implemented yet');
  }

  get surfaceHeating () {
    const stars = this.system.stars;
    const albedo = this.albedo;

    let heating = 0;

    stars.forEach((star) => {
      heating += SystemBody.getSurfaceHeating(star.luminosity, albedo, Coord.distance(this.position, star.position));
    });

    return Math.pow(heating, 0.25);
  }

  get minSurfaceHeating () {
    const stars = this.system.stars;
    const albedo = this.albedo;

    let heating = 0;

    stars.forEach((star) => {
      heating += SystemBody.getSurfaceHeating(star.luminosity, albedo, SystemBody.getMinBodyDistance(this, star));
    });

    return Math.pow(heating, 0.25);
  }

  get maxSurfaceHeating () {
    const stars = this.system.stars;
    const albedo = this.albedo;

    let heating = 0;

    stars.forEach((star) => {
      heating += SystemBody.getSurfaceHeating(star.luminosity, albedo, SystemBody.getMaxBodyDistance(this, star));
    });

    return Math.pow(heating, 0.25);
  }

  get avgSurfaceHeating () {
    return (this.minSurfaceHeating + this.maxSurfaceHeating)/2;
  }

  get surfaceTemp () {
    return this.surfaceHeating;
  }

  get minSurfaceTemp () {
    return this.minSurfaceHeating;
  }

  get maxSurfaceTemp () {
    return this.maxSurfaceHeating;
  }

  get avgSurfaceTemp () {
    return this.avgSurfaceHeating;
  }

  getSurfaceTemp (time) {
    throw new Error('TODO Not implemented yet');
  }
}
