import {State} from './State';

export class MineralsStockpile extends State{
  constructor(id, initialMinerals) {
    super(id);

    this._minerals = initialMinerals ? Object.assign({}, initialMinerals) : {};
  }

  getMineralQty(name) {
    return this._minerals.hasOwnProperty(name) ? +this._minerals[name] : 0;
  }
}
