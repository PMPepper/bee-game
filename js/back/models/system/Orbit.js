import {Model} from '../Model';

export class Orbit extends Model{
  constructor (id) {
    super(id);

    this._body = null;
  }

  update(newTime) {

  }

  getState() {
    return this._state({});
  }

  get body () {
    return this._body;
  }

  get period () {
    throw new Error('Not implemented');
  }

  get radius () {
    throw new Error('Not implemented');
  }

  get angle () {
    throw new Error('Not implemented');
  }

  get minRadius () {
    throw new Error('Not implemented');
  }

  get maxRadius () {
    throw new Error('Not implemented');
  }

  getPosition (time){
    throw new Error('Not implemented');
  }
}
