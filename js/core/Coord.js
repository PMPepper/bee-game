export class Coord {
  constructor (x, y) {
    this._x = x;
    this._y = y;

    Object.freeze(this);
  }

  get x () {
    return this._x;
  }

  get y () {
    return this._y;
  }

  getState() {
    return {'class':'Coord', x: this.x, y: this.y};
  }

  subtract (coord) {
    return new Coord(this.x - coord.x, this.y - coord.y);
  }

  add (coord) {
    return new Coord(this.x + coord.x, this.y + coord.y);
  }

  round() {
    return new Coord(Math.round(this.x), Math.round(this.y));
  }
}

Coord.ORIGIN = new Coord(0,0);


Coord.distance = (c1, c2) => {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;

  return Math.sqrt((dx*dx)+(dy*dy));
}
