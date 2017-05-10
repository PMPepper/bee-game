import {Model} from './Model'

export class Colony extends Model {
  constructor (faction, systemBody, population, mineralsStockpile, orbitalMinerals) {
    super();

    this._faction = faction;
    this._systemBody = systemBody;
    this._population = population;
    this._mineralsStockpile = mineralsStockpile
    this._orbitalMinerals = orbitalMinerals

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
      factionId:          Model.id(this.faction),
      systemBodyId:       Model.id(this.systemBody),
      population:         Model.id(this.population),
      mineralsStockpile:  Model.id(this.mineralsStockpile),
      orbitalMinerals:    Model.id(this.orbitalMinerals)
    });
  }
}
