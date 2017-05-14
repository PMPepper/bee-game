import {State} from './State';

export class KnownFaction extends State {
  //TODO loads of info about known faction, e.g. where/when you've seen them,
  //translation efforts, diplomatic info, etc
  constructor(id, factionId, fullName, shortName, adjectiveName) {
    super(id);

    this._factionId = factionId;
    this._fullName = fullName;
    this._shortName = shortName;
    this._adjectiveName = adjectiveName;
  }

  get factionId() {
    return this._factionId;
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
