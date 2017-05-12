//represents an colony belonging to a foreign faction

export class KnownColony {
  constructor(id, faction, systemBody) {
    this._id = id;
    this._faction = faction;
    this._systemBody = systemBody;
  }

  get id() {
    return this._id;
  }

  get faction() {
    return this._faction;
  }

  get systemBody() {
    return this._systemBody;
  }
}
