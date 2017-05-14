//Represets a colony for the client faction
import {State} from './State';

export class Colony extends State {
  constructor(id, systemBody, population, mineralsStockpile, orbitalMinerals) {
    super(id);

    this._systemBody = systemBody;
    this._population = population;
    this._mineralsStockpile = mineralsStockpile;
    this._orbitalMinerals = orbitalMinerals;

    this._removed = false;
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

  //
  get removed() {
    return this._removed;
  }

  set removed(value) {
    this._removed = !!value;

    this._changed();
  }
}
