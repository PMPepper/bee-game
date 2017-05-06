import {Model} from './Model';

export class Game extends Model {
  constructor (time, factions, systems, colonies, craft) {
    super();

    this._time = time;
    this._factions = factions ? Object.assign({}, factions) : {};
    this._systems = systems ? Object.assign({}, systems) : {};
    this._colonies = colonies ? Object.assign({}, colonies) : {};
    this._craft = craft ? Object.assign({}, craft) : {};
  }

  /*update(newTime, stepEvents) {
    //TODO, like everything else
    this._time = newTime;

    for(let prop in this.systems) {
      this.systems[prop].update(newTime, stepEvents)
    }
  }*/

  getNextUpdateTime() {
    const now = this.time;
    const nextTime = Number.MAX_VALUE;
    let hasFactions = false;

    for( let id in this._factions) {
      hasFactions = true;
      let faction = this._factions[i];

      if(faction.updateUntil === null) {
        nextTime = now;//a faction has not set their next update time, so no update
        break;
      } else {
        nextTime = nextTime < faction.updateUntil ? nextTime : faction.updateUntil ;
      }
    }

    //If there are any factions, return their next time, otherwise return now (no update)
    return hasFactions ? Math.max(nextTime, now) : now;
  }

  getUpdatedFactions() {
    const now = this.time;
    const updatedFactions = [];

    for( let id in this._factions) {
      let faction = this._factions[id];

      if(faction.updateUntil == now) {
        updatedFactions.push(faction);
      }
    }

    return updatedFactions;
  }

  getFactionStates(factions) {
    const factionStates = [];
    const allModels = {};
    const models = [];

    factions.forEach({faction} => {
      if(faction && this._factions[faction.id]) {
        factionStates.push(faction.getState(allModels));
      }
    });

    for(let id in allModels) {
      models.push(allModels[id]);
    }

    return {
      factionStates: factionStates,
      models: models
    };
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
