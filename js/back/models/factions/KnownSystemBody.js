import {Model} from '../Model';

export class KnownSystemBody extends Model {
  constructor(systemBody, name) {
    super();

    this._systemBody = systemBody;
    this._name = name;
  }

  get systemBody() {
    return this._systemBody;
  }

  get name() {
    return this._name;
  }

  getState() {
    return this._state({
      name: this.name,
      systemBodyId: Model.id(this.systemBody)
    });
  }
}
