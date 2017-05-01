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

Coord.distance = (c1, c2) => {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;

  return Math.sqrt((dx*dx)+(dy*dy));
}
