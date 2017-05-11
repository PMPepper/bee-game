export class SystemBodyMineral {
  constructor(id, name, amount, accessibility) {
    this._id = id;
    this._name = name;
    this._amount = amount;
    this._accessibility = accessibility;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get amount() {
    return this._amount;
  }

  get accessibility() {
    return this._accessibility;
  }
}
