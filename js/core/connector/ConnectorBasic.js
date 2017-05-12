//Basic connector connects Client to engine running on th same machine, in the same thread.
//Only really exists for development purposes. Real connectors would be split into two parts
//And the logic would deal with communications. This class fakes asyncrononus.
import {FactionGameState} from '../../front/states/FactionGameState';

export class ConnectorBasic {
  constructor (engine, client) {
    this._engine = engine;
    this._client = client;

    //register client factions with engine
    //engine can handle a clint with multiple factions,
    //but right now Client is single faction.
    this._engine.addClientConnectorForFaction(this, client.factionId);

    //get initial game state
    client.setConnector(this);
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
  _updateClient(stateObj) {
    console.log('_updateClient: ', stateObj);
    //convert flattened state into internal client state objects
    const factionGameState = new FactionGameState(stateObj);

    //update client
    this._client.update(factionGameState);
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
    this._engine.addFactionUpdates(factionUpdates);
  }

  _doGetCurrentGameState() {
    const gameState = this._engine.getCurrentGameState(this._engine.getFactionForClientConnector(this));

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
