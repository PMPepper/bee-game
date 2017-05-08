export class Faction {
  constructor(id, name, knownFactions, knownSystems) {
    this._id = id;
    this._name = name;
    this._knownFactions = knownFactions;
    this._knownSystems = knownSystems;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get knownFactions() {
    return this._knownFactions;
  }

  get knownSystems() {
    return this._knownSystems
  }
}
