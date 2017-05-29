import Model from '../Model';

export class KnownFaction extends Model {
  constructor(faction, fullName, shortName, adjectiveName) {
    super();

    this._faction = faction;
    this._fullName = fullName;
    this._shortName = shortName;
    this._adjectiveName = adjectiveName;
  }

  get faction () {
    return this._faction;
  }

  get fullName () {
    return this._fullName;
  }

  get shortName () {
    return this._shortName;
  }

  get adjectiveName () {
    return this._adjectiveName;
  }

  getState () {
    return this._state({
      factionId:      Model.id(this.faction),
      fullName:       this.fullName,
      shortName:      this.shortName,
      adjectiveName:  this.adjectiveName
    });
  }
}
