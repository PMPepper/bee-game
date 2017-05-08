export class KnownFaction {
  //TODO loads of info about known faction, e.g. where/when you've seen them,
  //translation efforts, diplomatic info, etc
  constructor(id, faction, name) {
    this._id = id;
    this._faction = faction;
    this._name = name;
  }

  get id() {
    return this._id;
  }

  get faction() {
    return this_faction;
  }

  get name() {
    return this._name;
  }
}
