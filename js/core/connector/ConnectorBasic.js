export class ConnectorBasic {
  constructor (engine, client) {
    this._engine = engine;
    this._client = client;

    client.setConnector(this);

    //Set initial state
    client.update(engine.getState());
  }
}
