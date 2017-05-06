import {Model} from '../Model';

export class KnownFaction extends Model {
  constructor(faction, name) {
    super();

    this._faction = faction;
    this._name = name;
  }

  get faction () {
    return this._faction;
  }

  get name () {
    return this._name;
  }

  getState () {
    return this._state({
      factionId: Model.id(this.faction),
      name:this.name
    });
  }
}
