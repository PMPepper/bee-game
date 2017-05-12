import {Model} from '../models/Model';

const minTimeStep = 1;

export class Engine {
  constructor(gameModel) {
    this._gameModel = gameModel;

    this._clientConnectors = [];
    this._factionClientConnectors = {};
  }

  addClientConnectorForFaction(clientConnector, factionId) {
    if(this._clientConnectors.indexOf(clientConnector)==-1) {
      this._clientConnectors.push(clientConnector);
    }

    this._factionClientConnectors[factionId] = clientConnector;
  }

  getClientConnectorForFaction(faction) {
    return this._factionClientConnectors[Model.id(faction)] || null;
  }

  getFactionForClientConnector(clientConnector) {
    for(let factionId in this._factionClientConnectors) {
      if(this._factionClientConnectors[factionId] == clientConnector) {
        return this._gameModel.factions[factionId];
      }
    }

    return null;
  }

  //Expects array of faction update objects
  addFactionUpdates(factionUpdate) {

    //TODO update models with faction updates
    //This can wait until next phase
    //-temp code
    this._gameModel.factions[factionUpdate.id].updateUntil = factionUpdate.updateUntil;
    //END TODO

    //find first time that someone is waiting for
    const nextUpdateTime = this._gameModel.getNextUpdateTime();

    //update until that point
    this._gameModel.update(nextUpdateTime);

    //get list of all factions that have reached their faction update time
    const updatedFactions = this._gameModel.getUpdatedFactions();

    updatedFactions.forEach((faction) => {
      //get new game state object
      const gameState = this._gameModel.getGameStateForFaction(faction);

      //send to clientConnector
      this.getClientConnectorForFaction(faction).doClientUpdate(gameState);
    });
  }

  getCurrentGameState(faction) {
    return this._gameModel.getGameStateForFaction(faction);
  }

  get systems () {
    return this._systems;
  }

  get time () {
    return this._time;
  }
}
