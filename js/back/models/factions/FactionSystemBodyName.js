import {Model} from '../Model';

export class FactionSystemBodyName extends Model () {
  constructor(id, systemBody, name) {
    super(id);

    this._systemBody = systemBody;
    this._name = name;
  }

  get systemBody() {
    return this._systemBody;
  }

  get name() {
    return this._name;
  }
}
