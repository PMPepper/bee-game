import {SystemBody} from './SystemBody';

export class SubStellarBody extends SystemBody {
  constructor (name, mass, radius, parent, orbit, albedo, minerals, colonies) {
    super(name, mass, radius, parent, orbit);

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

  get minSurfaceTemp () {
    return this.minSurfaceHeating;
  }

  get maxSurfaceTemp () {
    return this.maxSurfaceHeating;
  }

  get avgSurfaceTemp () {
    return this.avgSurfaceHeating;
  }

}
