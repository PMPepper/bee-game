import {Model} from './Model'

export class Colony extends Model {
  constructor (faction, systemBody, population, minerals) {
    super();

    this._faction = faction;
    this._systemBody = systemBody;
    this._population = population;
    this._minerals = minerals

    faction.addColony(this);
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
      factionId:    Model.id(this.faction),
      systemBodyId: Model.id(this.systemBody),
      population:   Model.id(this.population),
      mineralsId:   Model.id(this.minerals)
    });
  }
}
