//represets a stockpile of minerals

//TODO implement

import {Model} from './Model'

export class MineralsStockpile extends Model {
  constructor (initialMinerals) {
    super();

    this._minerals = initialMinerals ? Object.assign({}, initialMinerals) : {};
  }

  getMineralQty(name) {
    return this._minerals.hasOwnProperty(name) ? +this._minerals[name] : 0;
  }

  setMineralQty(name, qty) {
    return this._minerals[name+'']  = +qty;
  }

  getState () {
    return this._state(Object.assign({}, this._minerals));
  }
}
