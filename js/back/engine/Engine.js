const minTimeStep = 1;

export class Engine {
  constructor(gameModel) {
    this._gameModel = gameModel;

    this._clientConnectors = [];
    this._factionClientConnectors = {};

    this._lastStepEvents = [];
    this._updateTimeStep(0, this._lastStepEvents);
  }

  addClientConnectorForFactions(clientConnector, factionIds) {
    if(this._clientConnectors.indexOf()==-1) {
      this._clientConnectors.push(clientConnector);
    }

    factionIds.forEach((factionId) => {
      this._factionClientConnectors[factionId] = clientConnector;
    });
  }

  getClientConnectorForFaction(faction) {
    return this._factionClientConnectors[faction.id] || null;
  }

  getFactionsForClientConnector(clientConnector) {
    const factions = [];

    for(let factionId in this._factionClientConnectors) {
      if(this._factionClientConnectors[factionId] == clientConnector) {
        factions.push(this._gameModel.factions[factionId]);
      }
    }

    return factions;
  }

  addFactionUpdates(factionUpdates) {

    //TODO update models with faction updates
    //This can wait until next phase
    //-temp code
    factionUpdates.forEach((factionUpdate) => {
      this._gameModel.factions[factionUpdate.id].updateUntil = updateUntil;
    });
    //END TODO

    //find first time that someone is waiting for
    const nextUpdateTime = this._gameModel.getNextUpdateTime();

    //update until that point
    this._gameModel.update(nextUpdateTime);

    //get list of all factions that have reached their faction update time
    const updatedFactions = this._gameMode.getUpdatedFactions();

    //group into clientConnectors
    this._splitFactionsByClientConnector(updatedFactions, (clientConnector, factions) => {
      //get new game state object
      const gameState = this._gameModel.getGameStateForFactions(factions);

      //send to clientConnector
      clientConnector.doClientUpdate(gameState);
    })
  }

  _splitFactionsByClientConnector(factions, handler) {
    this._clientConnectors.forEach((clientConnector) => {
      const factions = factions.filter((faction) => {
        return this._factionClientConnectors[faction.id] == clientConnector;
      });

      if(factions.length > 0) {
        handler(clientConnector, factions);
      }
    });
  }

  get systems () {
    return this._systems;
  }

  get time () {
    return this._time;
  }
}
