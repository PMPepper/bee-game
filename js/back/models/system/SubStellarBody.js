import Model from '../Model';
import {SystemBody} from './SystemBody';
import {Coord} from '../../../core/Coord';

export class SubStellarBody extends SystemBody {
  constructor (mass, radius, day, axialTilt, tidalLock, parent, orbit, albedo, minerals, colonies) {
    super(mass, radius, day, axialTilt, tidalLock, parent, orbit);

    this._albedo = albedo;
    this._minerals = minerals || null;
    this._colonies = colonies ? Object.assign({}, colonies) : {};

    this._bodyState.albedo = albedo;
    this._bodyState.mineralsId = Model.id(minerals);

  }

  get isColonisable() {
    return true;
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

  addColony(colony) {
    this.colonies[colony.id] = colony;
  }

  hasColony(colony) {
    return this.colonies[colony.id] === colony;
  }

  removeColony(colony) {
    let index;

    if(colony && this.hasColony(colony)) {
      delete this.colonies[colony.id];

      colony.dispose();
    }
  }

  update(newTime, deltaTime, events) {

    super.update(newTime, deltaTime, events);

    //update variable system body state
    this._bodyState.surfaceHeating = this.surfaceHeating;
    this._bodyState.surfaceTemp = this.surfaceTemp;

    //TODO update colonies, minerals, etc
    const colonies = this.colonies;

    for(let id in colonies){
      if(colonies.hasOwnProperty(id)) {
        colonies[id].update(newTime, deltaTime, events);
      }
    }
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
      this._bodyState.mineralsId = Model.id(value);
    }
  }

  get colonies () {
    return this._colonies;
  }

  getColonyByFaction(faction) {
    const colonies = this.colonies;

    for(id in colonies) {
      if(colonies.hasOwnProperty(id)) {
        let colony = colonies[id];

        if(colony.faction == faction) {
          return colony;
        }
      }
    }

    return null;
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
