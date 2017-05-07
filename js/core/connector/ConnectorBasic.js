//Basic connector connects Client to engine running on th same machine, in the same thread.
//Only really exists for development purposes. Real connectors would be split into two parts
//And the logic would deal with communications. This class fakes asyncrononus.

export class ConnectorBasic {
  constructor (engine, client) {
    this._engine = engine;
    this._client = client;

    //register client factions with engine
    this._engine.addClientConnectorForFactions(this, client.factions);

    //get initial game state
    this.getCurrentGameState();
  }

  ////////////////////////////////
  // Client side of connections //
  ////////////////////////////////

  updateEngine(factionUpdates) {
    //TODO flatten/serialise data
    const factionUpdatesData = factionUpdates;

    //Simulate sending data to engine-side of connector
    setTimeout(() => {
      this._applyFactionUpdates(factionUpdatesData);
    }, 0);
  }

  //-This is called when a faction gets updated
  _updateClient(gameState) {
    console.log('_updateClient: ', gameState);
    /*
    //Parse faction state data into actual state objects and update client
    const factionState = StateFactory.getFaction(factionStateData);
    const factionEvents = StateFactory.getEvents(factionEventsData);

    this.client.updateFaction(factionState, factionEvents);*/
  }

  getCurrentGameState() {
    setTimeout(() => {
      this._doGetCurrentGameState();
    });
  }

  //////////////////////////////
  // Engine side of connector //
  //////////////////////////////

  _applyFactionUpdates(factionUpdates) {
    this.engine.addFactionUpdates(factionUpdates);
  }

  _doGetCurrentGameState() {
    const gameState = this._engine.getCurrentGameState(this._engine.getFactionsForClientConnector(this));

    setTimeout(() => {
      this._updateClient(gameState);
    }, 0);
  }

  doClientUpdate(gameState) {
    setTimeout(() => {
      this._updateClient(gameState);
    }, 0);
  }
}
