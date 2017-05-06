import {Model} from './Model'

export class Colony extends Model {
  constructor (systemBody, population, minerals) {
    super();

    this._faction = null;
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
      faction:Model.id(this.faction),
      systemBody: Model.id(this.systemBody),
      population: Model.id(this.population,
      minerals: Model.id(this.minerals);
    });
  }
}
