import {Model} from '../Model';

export class KnownFaction extends Model {
  constructor(id, faction, name) {
    super(id);

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
      faction: this.faction.id,
      name:this.name
    });
  }
}
