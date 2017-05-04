import {Model} from './Model'

export class Colony extends Model {
  constructor (id, systemBody, population, minerals) {
    super(id);

    this._faction = faction;
    this._systemBody = systemBody;
    this._population = population;
    this._minerals = minerals
  }

  setFaction(faction)  {
    this._faction = faction;
  }

  get faction () {
    return this._faction;
  }

  get systemBody () {
    return this._systemBody;
  }

  get population () {
    return this._population;
  }

  get minerals () {
    return this._minerals
  }

  getState () {
    return this._state({
      faction:this.faction.id,
      systemBody: this.systemBody.id,
      population: this.population,
      minerals: this.minerals.getState()
    });
  }
}
