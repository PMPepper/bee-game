export class KnownSystemBody {
  constructor(id, systemBody, name) {
    this._id = id;
    this._systemBody = systemBody;
    this._name = name;
  }

  get id() {
    return this._id;
  }

  get systemBody() {
    return this._systemBody;
  }

  get name() {
    return this._name;
  }
}
