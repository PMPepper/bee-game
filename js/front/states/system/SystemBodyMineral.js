import {State} from '../State';

export class SystemBodyMineral extends State{
  constructor(id, name, amount, accessibility) {
    super(id);

    this._name = name;
    this._amount = amount;
    this._accessibility = accessibility;
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
