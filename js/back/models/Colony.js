import {Model} from './Model'
import {MineralsStockpile} from './MineralsStockpile'
import {Constants} from '../../core/Constants'

export class Colony extends Model {
  constructor (faction, systemBody, population, mineralsStockpile, orbitalMinerals) {
    super();

    this._faction = faction;
    this._systemBody = systemBody;
    this._population = population;
    this._mineralsStockpile = mineralsStockpile || new MineralsStockpile()
    this._orbitalMinerals = orbitalMinerals || new MineralsStockpile()

    faction.addColony(this);
    systemBody.addColony(this);
  }

  update(newTime, deltaTime, events) {
    if(deltaTime <= 0) {
      return ;
    }

    this._population = this._population * Math.pow(this.populationGrowthRate, (deltaTime / Constants.YEAR));
  }

  get faction () {
    return this._faction;
  }

  get systemBody () {
    return this._systemBody;
  }

  get population () {
    return Math.floor(this._population);
  }

  //populate growth rate is per annum
  get populationGrowthRate() {
    return 1.05;//TODO actually calculate this based on something
  }

  get mineralsStockpile () {
    return this._mineralsStockpile
  }

  get orbitalMinerals () {
    return this._orbitalMinerals;
  }

  getState () {
    return this._state({
      factionId:            Model.id(this.faction),
      systemBodyId:         Model.id(this.systemBody),
      population:           this.population,
      mineralsStockpileId:  Model.id(this.mineralsStockpile),
      orbitalMineralsId:    Model.id(this.orbitalMinerals)
    });
  }

  _dispose() {
    this.faction.removeColony(this);
    this.systemBody.removeColony(this);

    this._faction = null;
    this._systemBody = null;
    this._mineralsStockpile = null
    this._orbitalMinerals = null
  }
}
