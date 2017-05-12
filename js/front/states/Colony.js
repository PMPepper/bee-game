//Represets a colony for the client faction

export class Colony {
  constructor(id, systemBody, population, mineralsStockpile, orbitalMinerals) {
    this._id = id;
    this._systemBody = systemBody;
    this._population = population;
    this._mineralsStockpile = mineralsStockpile;
    this._orbitalMinerals = orbitalMinerals;
  }

  get id() {
    return this._id;
  }

  get systemBody() {
    return this._systemBody;
  }

  get population() {
    return this._population;
  }

  get mineralsStockpile() {
    return this._mineralsStockpile;
  }

  get orbitalMinerals() {
    return this._orbitalMinerals;
  }
}
