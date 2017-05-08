export class KnownFaction {
  //TODO loads of info about known faction, e.g. where/when you've seen them,
  //translation efforts, diplomatic info, etc
  constructor(id, faction, fullName, shortName, adjectiveName) {
    this._id = id;
    this._faction = faction;
    this._fullName = fullName;
    this._shortName = shortName;
    this._adjectiveName = adjectiveName;
  }

  get id() {
    return this._id;
  }

  get faction() {
    return this_faction;
  }

  get fullName() {
    return this._fullName;
  }

  get shortName() {
    return this._shortName;
  }

  get adjectiveName() {
    return this._adjectiveName;
  }

}
