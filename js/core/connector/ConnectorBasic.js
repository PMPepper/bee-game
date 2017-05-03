export class ConnectorBasic {
  constructor (engine, client) {
    this._engine = engine;
    this._client = client;

    client.setConnector(this);

    //Set initial state
    client.update(engine.getState());
  }

  updateEngine(time) {
    const newState = this._engine.update(time);
    const self = this;

    //fake async for now
    setTimeout(() => {
      self._client.update(newState);
    }, 0)
  }
}
