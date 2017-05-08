import {Model} from './Model';

export class Game extends Model {
  constructor (time) {
    super();

    this._time = time;
    this._factions = {};
    this._systems = {};
    this._colonies = {};
    this._craft = {};
  }


  update(nextUpdateTime) {
    //TODO this is gonna need work to do anything else...

    for(let id in this._systems) {
      this._systems[id].update(nextUpdateTime);
    }

    this._time = nextUpdateTime;
  }

  getNextUpdateTime() {
    const now = this.time;
    let nextTime = Number.MAX_VALUE;
    let hasFactions = false;

    for( let id in this._factions) {
      hasFactions = true;
      let faction = this._factions[id];

      if(faction.updateUntil === null) {
        nextTime = now;//a faction has not set their next update time, so no update (game must wait for them)
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

  getGameStateForFactions (factions) {
    const allModels = {};
    const factionEvents = {};

    const getAndAddStateById = (id) => {
      if(allModels.hasOwnProperty(id)) {
        return;
      }

      let model = Model.getById(id);

      if(!(model instanceof Model)) {
        return;
      }

      getAllStateObjs(model.getState());
    }

    const getAllStateObjs = (stateObj) => {
      if(!stateObj || allModels.hasOwnProperty(stateObj.id)) {
        return;
      }

      allModels[stateObj.id] = stateObj;

      for(let prop in stateObj) {
        let val = stateObj[prop];

        if(prop.slice(-2) == 'Id') {
          getAndAddStateById(val);
        } else if(prop.slice(-3) == 'Ids') {
          val.forEach((id) => {
            getAndAddStateById(id);
          });
        }
      }
    }

    factions.forEach((faction) => {
      const factionStateObj = faction.getState();

      //get all referenced models and flatten
      getAllStateObjs(factionStateObj);

      //TODO populate array with event state objects
      factionEvents[factionStateObj.id] = [];
    });


    return {
      models: allModels,
      time: this._time,
      factionEvents: factionEvents
    };
  }

  addFaction(faction) {
    this._factions[faction.id] = faction;
  }

  addSystem(system) {
    this._systems[system.id] = system;

    system.update(this.time);
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
