export class Orbit{
  constructor () {
    this._body = null;
  }

  update(newTime) {

  }

  getState() {

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
