import {HexCoords} from "./HexCoords";
import {CubeCoords} from "./CubeCoords";
import {OffsetCoords} from "./OffsetCoords";

export class AxialCoords extends HexCoords{
  constructor(col, row, grid) {
    super(grid);

    if(!Number.isInteger(col)) {
      throw new Error( `Invalid Argument: "col" must be an integer, value was "${col}"` );
    }

    if(!Number.isInteger(row)) {
      throw new Error( `Invalid Argument: "row" must be an integer, value was "${row}"` );
    }

    this._col = col;
    this._row = row;
  }

  get col () {return this._col;}
  get row () {return this._row;}

  add (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords"');
    }

    /*if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }*/

    if(!(coord instanceof AxialCoords)) {
      coord = coord.toAxialCoords();
    }

    return new AxialCoords(this.col + coord.col, this.row + coord.row, this.grid);
  }

  subtract (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords"');
    }

    /*if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }*/

    if(!(coord instanceof AxialCoords)) {
      coord = coord.toAxialCoords();
    }

    return new AxialCoords(this.col - coord.col, this.row - coord.row, this.grid);
  }

  equals (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords"');
    }

    /*if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }*/

    if(!(coord instanceof AxialCoords)) {
      coord = coord.toAxialCoords();
    }

    return this.col === coord.col && this.row == coord.row;
  }

  distanceTo (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords"');
    }

    /*if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }*/

    //TODO
  }

  getDirection (direction) {
    //TODO
    //WTF does this mean?
  }

  isNeighbour (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords"');
    }

    /*if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }*/

    throw new Error('Not implemented');
    //TODO
  }

  getNeighbours () {
    throw new Error('Not implemented');
  }

  getNeighbour (direction) {
    if(!HexCoords.Directions.isValid(direction)) {
      throw new Error(`Invalid argument 'direction', unknow value '${direction}'`);
    }

    throw new Error('Not implemented');
  }

  toAxialCoords() {
    return this;
  }

  toCubeCoords () {
    return new CubeCoords(this.col, this.row, -this.col-this.row, this.grid);
  }

  toOffsetCoords (layout) {
    let x = this.col;
    let y = this.row;
    let z = -this.col-this.row;
    let layouts = OffsetCoords.Layouts;

    switch(layout) {
      case layouts.EvenCol:
        return new OffsetCoords(x, z + (x + (x&1)) / 2, layout, this.grid);
      case layouts.OddCol:
        return new OffsetCoords(x, z + (x - (x&1)) / 2, layout, this.grid);
      case layouts.EvenRow:
        return new OffsetCoords(x + (z + (z&1)) / 2, z, layout, this.grid);
      case layouts.OddRow:
        return new OffsetCoords(x + (z - (z&1)) / 2, z, layout, this.grid);
    }

    throw new Error( `Cannot convert to OffsetCoords: Unknown layout "${layout}"` );
  }

  toString () {
    return `AxialCoords {col: ${this.col}, row: ${this.row}, orientation: ${this.orientation}}`;
  }

  get DirectionCoordinateOffsets() {
    return DirectionCoordinateOffsets;
  }

  getDirectionCoordinateOffset(direction) {
    if(!HexCoords.Directions.isValid(direction)) {
      throw new Error(`Invalid argument 'direction', unknow value '${direction}'`);
    }

    return DirectionCoordinateOffsets[direction];
  }

  /*static get DirectionCoordinateOffsets () {
    return DirectionCoordinateOffsets;
  };

  static getDirectionCoordinateOffset(direction) {
    if(!(direction in DirectionCoordinateOffsets)) {
      throw new Error(`Invalid argument 'direction', unknow value '${direction}'`);
    }

    return DirectionCoordinateOffsets[direction];
  }*/
}

const DirectionCoordinateOffsets = Object.freeze({
  upRight: new AxialCoords(1, -1),
  right: new AxialCoords(1, 0),
  downRight: new AxialCoords(0, 1),
  downLeft: new AxialCoords(-1, 1),
  left: new AxialCoords(-1, 0),
  upLeft: new AxialCoords(0, -1)
});

/*//Flat top
const DirectionCoordinateOffsets = Object.freeze({
  up: new AxialCoords(0, -1),
  upRight: new AxialCoords(1, -1),
  downRight: new AxialCoords(1, 0),
  down: new AxialCoords(0, 1),
  downLeft: new AxialCoords(-1, 1),
  upLeft: new AxialCoords(-1, 0)
});*/
