//Represets a colony for the client faction
import {State} from './State';
import {MineralsStockpile} from './MineralsStockpile';

export class Colony extends State {
  constructor(id, systemBody, population, mineralsStockpile, orbitalMinerals) {
    super(id);

    this._systemBody = systemBody;
    this._population = population;
    this._mineralsStockpile = mineralsStockpile || new MineralsStockpile();
    this._orbitalMinerals = orbitalMinerals || new MineralsStockpile();

    this._knownSystemBody = null;

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

  get knownSystemBody() {
    return this._knownSystemBody;
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
