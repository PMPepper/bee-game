import {Model} from './Model'
import {MineralsStockpile} from './MineralsStockpile'

export class Colony extends Model {
  constructor (faction, systemBody, population, mineralsStockpile, orbitalMinerals) {
    super();

    this._faction = faction;
    this._systemBody = systemBody;
    this._population = population;
    this._mineralsStockpile = mineralsStockpile || new MineralsStockpile()
    this._orbitalMinerals = orbitalMinerals || new MineralsStockpile()

    faction.addColony(this);
  }

  get faction () {
    return this._faction;
  }

  get systemBody () {
    return this._systemBody;
  }

  get population () {
    return this._population;
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
      population:           Model.id(this.population),
      mineralsStockpileId:  Model.id(this.mineralsStockpile),
      orbitalMineralsId:    Model.id(this.orbitalMinerals)
    });
  }
}
