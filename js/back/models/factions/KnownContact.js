import {Model} from '../Model';

//TODO

export class KnownContact extends Model {
  constructor (id) {
    super(id);
  }

  getState () {
    return this._state({

    });
  }
}
