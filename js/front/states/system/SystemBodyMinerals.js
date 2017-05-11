//Collection of SystemBodyMineral objects

export class SystemBodyMinerals {
  constructor (id, minerals) {
    this._id = id;

    this._minerals = minerals || [];
  }

  get id() {
    return this._id;
  }

  getMineralByName(name) {
    const minerals = this.minerals;

    for(let i = 0; i < minerals.length; i++) {
      if(minerals[i].name == nane) {
        return minerals[i];
      }
    }

    return null;
  }
}
