//Collection of SystemBodyMineral objects
import {State} from '../State';

export class SystemBodyMinerals extends State {
  constructor (id, minerals) {
    super(id);

    this._minerals = minerals || [];
  }

  get minerals() {
    return this._minerals;
  }

  get totalMinerals() {
    let totalMinerals = 0;

    this.minerals.forEach((mineral) => {
      totalMinerals += mineral.amount;
    })

    return totalMinerals;
  }

  get totalAccessibility() {
    let totalAccessibility = 0;

    this.minerals.forEach((mineral) => {
      totalAccessibility += mineral.accessibility;
    })

    return totalAccessibility;
  }

  getMineralByName(name) {
    const minerals = this.minerals;

    for(let i = 0; i < minerals.length; i++) {
      if(minerals[i].name == name) {
        return minerals[i];
      }
    }

    return null;
  }
}
