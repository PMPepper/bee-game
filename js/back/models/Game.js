import {Model} from './Model';

export class Game extends Model {
  constructor (gameConfig) {
    super();

    globalGameConfig = this._gameConfig = gameConfig;

    this._time = gameConfig.gameStartTime;
    this._factions = {};
    this._systems = {};

    this._factionTempIds = {};
  }


  update(nextUpdateTime) {
    const deltaTime = nextUpdateTime - this.time;
    const events = [];//TODO does this make any sense??
    //TODO this is gonna need work to do anything else...

    for(let id in this._systems) {
      this._systems[id].update(nextUpdateTime, deltaTime, events);
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

  getGameStateForFaction (faction) {
    const allModels = {};
    const factionEvents = [];

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

    const factionStateObj = faction.getState();

    //get all referenced models and flatten
    getAllStateObjs(factionStateObj);

    //TODO populate factionEvents array with event state objects

    return {
      models: allModels,
      time: this._time,
      factionId: factionStateObj.id,
      events: factionEvents,
      reconciliation: this._factionTempIds[faction.id] || null
    };
  }

  addFaction(faction) {
    this._factions[faction.id] = faction;
  }

  addSystem(system) {
    this._systems[system.id] = system;

    system.update(this.time, 0, null);
  }

  addIdReconciliation(factionId, tempId, newId) {
    if(!this._factionTempIds[factionId]) {
      this._factionTempIds[factionId] = {};
    }

    this._factionTempIds[factionId][tempId] = newId;
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

  //Used for saving the game (not yet implemented)
  getState () {
    return this._state({
      'class': 'Game',
      time: this.time,
      systems: this.getObjectState(this.systems),
      factions: this.getObjectState(this.factions),
      reconciliation: this._factionTempIds
    });
  }
}

let globalGameConfig;

Game.getGameConfig = () => {
  return globalGameConfig;
}
