export class Coord {
  constructor (x, y) {
    this._x = x;
    this._y = y;
  }

  get x () {
    return this._x;
  }

  get y () {
    return this._y;
  }
}

Coord.ORIGIN = new Coord(0,0);
