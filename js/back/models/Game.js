import {Model} from './Model';

export class Game extends Model {
  constructor (id, time, factions, systems, colonies, craft) {
    super(id);

    this._time = time;
    this._factions = factions ? Object.assign({}, factions) : {};
    this._systems = systems ? Object.assign({}, systems) : {};
    this._colonies = colonies ? Object.assign({}, colonies) : {};
    this._craft = craft ? Object.assign({}, craft) : {};
  }

  update(newTime, stepEvents) {
    //TODO, like everything else
    this._time = newTime;

    for(let prop in this.systems) {
      this.systems[prop].update(newTime, stepEvents)
    }
  }

  addFaction(faction) {
    this._factions[faction.id] = faction;
  }

  addSystem(system) {
    this._systems[system.id] = system;
  }

  get time() {
    return this._time;
  }

  get factions() {
    return this._factions;
  }

  get systems () {
    return this._systems;
  }

  get colonies () {
    return this._colonies;
  }

  get craft () {
    return this._craft;
  }

  getState () {
    return this._state({
      'class': 'Game',
      time: this.time,
      systems: this.getObjectState(this.systems),
      factions: this.getObjectState(this.factions),
      colonies: this.getObjectState(this.colonies),
      craft: this.getObjectState(this.craft)
    });
  }
}
