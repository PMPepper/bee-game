import {Model} from '../models/Model';
import {Colony} from '../models/Colony';

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
    const factionId = factionUpdate.id;
    const faction = this._gameModel.factions[factionUpdate.id];
    const changes = factionUpdate.changes;

    faction.updateUntil = factionUpdate.updateUntil;

    //colonies
    //-added
    for(let id in changes.colonies.added) {
      if(changes.colonies.added.hasOwnProperty(id)) {
        let systemBodyId = changes.colonies.added[id];
        let systemBody = Model.getById(systemBodyId);

        //Is this a systemBody that can be colonised?
        if(!systemBody || !systemBody.isColonisable) {
          continue;//nope!
        }

        //Do you know about this systemBody, and is it not already colonised
        if(!faction.isKnownSystemBody(systemBody) || systemBody.getColonyByFaction(faction) != null) {
          continue;//nope!
        }

        //ok, you can add a colony here
        //faction, systemBody, population, mineralsStockpile, orbitalMinerals
        let newColony = new Colony(faction, systemBody, 0, null, null);

        this._gameModel.addIdReconciliation(faction.id, id, newColony.id);
      }
    }
    //-removed
    for(let id in changes.colonies.removed) {
      if(changes.colonies.removed.hasOwnProperty(id)) {
        let colony = faction.getColonyById(id);

        if(colony) {
          colony.dispose();
        }
      }
    }

    //TODO update models with faction updates
    //This can wait until next phase
    //END TODO

    this._nextUpdate();
  }

  _nextUpdate() {
    //find first time that someone is waiting for
    const nextUpdateTime = this._gameModel.getNextUpdateTime();

    if(nextUpdateTime > this._gameModel.time) {
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
  }

  getCurrentGameState(faction) {
    return this._gameModel.getGameStateForFaction(faction);
  }

  get config() {
    return this._config;
  }
}
