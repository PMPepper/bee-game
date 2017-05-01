export class Orbit{
  constructor () {
    this._body = null;
  }

  get body () {
    return this._body;
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
