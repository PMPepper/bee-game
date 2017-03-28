import {Enum} from '../../Enum.js'

import {HexCoords} from "./HexCoords";
import {AxialCoords} from "./AxialCoords";
import {CubeCoords} from "./CubeCoords";

export class OffsetCoords extends HexCoords{
  constructor(col, row, layout, grid) {
    super(grid);

    if(!Number.isInteger(col)) {
      throw new Error( `Invalid Argument: "col" must be an integer, value was "${col}"` );
    }

    if(!Number.isInteger(row)) {
      throw new Error( `Invalid Argument: "row" must be an integer, value was "${row}"` );
    }

    if(!(layout in Layouts)) {
      throw new Error( `Invalid Argument: Invalid layout "${layout}"` );
    }

    this._col = col;
    this._row = row;
    this._layout = layout;
  }

  get col () {return this._col;}
  get row () {return this._row;}
  get layout () {return this._layout;}

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

    if(!(coord instanceof OffsetCoords) || this.layout != coord.layout) {
      coord = coord.toOffsetCoords(this.layout);
    }

    return new OffsetCoords(this.col + coord.col, this.row + coord.row, this.layout, this.grid);
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

    if(!(coord instanceof OffsetCoords) || this.layout != coord.layout) {
      coord = coord.toOffsetCoords(this.layout);
    }

    return new OffsetCoords(this.col - coord.col, this.row - coord.row, this.layout, this.grid);
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

    if(!(coord instanceof OffsetCoords)) {
      coord = coord.toOffsetCoords();
    }

    return this.col === coord.col && this.row === coord.row && this.layout === coord.layout;
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
  }

  getNeighbours () {
    throw new Error('Not implemented');
  }

  toAxialCoords () {
    let x;//Cube coords
    let z;
    const col = this.col;
    const row = this.row;

    switch(this.layout) {
      /*case Layouts.evenCol:
        x = col;
        z = row - (col + (col&1)) / 2;
        break;
      case Layouts.oddCol:
        x = col;
        z = row - (col - (col&1)) / 2;
        break;*/
      case Layouts.evenRow:
        x = col - (row + (row&1)) / 2;
        z = row;
        break;
      case Layouts.oddRow:
        x = col - (row - (row&1)) / 2;
        z = row;
        break;
    }

    //Convert Cube coords to axial coords
    return new AxialCoords(x, z, this.grid);
  }

  toCubeCoords () {
    let x;
    let y;
    let z;
    const col = this.col;
    const row = this.row;

    switch(this.layout) {
      /*case Layouts.evenCol:
        x = col;
        z = row - (col + (col&1)) / 2;
        y = -x-z;
        break;
      case Layouts.oddCol:
        x = col;
        z = row - (col - (col&1)) / 2;
        y = -x-z;
        break;*/
      case Layouts.evenRow:
        x = col - (row + (row&1)) / 2;
        z = row;
        y = -x-z;
        break;
      case Layouts.oddRow:
        x = col - (row - (row&1)) / 2;
        z = row;
        y = -x-z;
        break;
    }

    return new CubeCoords(x, y, z, this.grid);
  }

  toOffsetCoords (layout) {
    if(layout === this.layout) {
      return this;
    }

    //Convert into cube coords
    let x;
    let y;
    let z;
    let col = this.col;
    let row = this.row;

    switch(this.layout) {
      /*case layouts.EvenCol:
        x = col;
        z = row - (col + (col&1)) / 2;
        y = -x-z;
        break;
      case layouts.OddCol:
        x = col;
        z = row - (col - (col&1)) / 2;
        y = -x-z;
        break;*/
      case layouts.EvenRow:
        x = col - (row + (row&1)) / 2;
        z = row;
        y = -x-z;
        break;
      case layouts.OddRow:
        x = col - (row - (row&1)) / 2;
        z = row;
        y = -x-z;
        break;
    }

    //Now output into new layout
    switch(layout) {
      /*case layouts.EvenCol:
        return new OffsetCoords(x, z + (x + (x&1)) / 2, layout, this.grid);
      case layouts.OddCol:
        return new OffsetCoords(x, z + (x - (x&1)) / 2, layout, this.grid);*/
      case layouts.EvenRow:
        return new OffsetCoords(x + (z + (z&1)) / 2, z, layout, this.grid);
      case layouts.OddRow:
        return new OffsetCoords(x + (z - (z&1)) / 2, z, layout, this.grid);
    }

    throw new Error( `Cannot convert to OffsetCoords: Unknown layout "${layout}"` );
  }

  toString () {
    return `OffsetCoords {col: ${this.col}, row: ${this.row}, layout: ${this.layout}, orientation: ${this.orientation}}`;
  }

  get DirectionCoordinateOffsets() {
    return this.layout == Layouts.oddRow ? OddRowDirectionCoordinateOffsets : EvenRowDirectionCoordinateOffsets;
  }

  getDirectionCoordinateOffset(direction) {
    if(!HexCoords.Directions.isValid(direction)) {
      throw new Error(`Invalid argument 'direction', unknow value '${direction}'`);
    }

    return this.DirectionCoordinateOffsets[direction];
  }

  static get Layouts () {
    return Layouts;
  }

}

const Layouts = Enum(
  "oddRow",
  "evenRow"
);

const OddRowDirectionCoordinateOffsets = Object.freeze({
  upRight: new OffsetCoords(1, 0, Layouts.oddRow),
  right: new OffsetCoords(1, -1, Layouts.oddRow),
  downRight: new OffsetCoords(0, -1, Layouts.oddRow),
  downLeft: new OffsetCoords(-1, 0, Layouts.oddRow),
  left: new OffsetCoords(-1, 1, Layouts.oddRow),
  upLeft: new OffsetCoords(0, 1, Layouts.oddRow)
});

const EvenRowDirectionCoordinateOffsets = Object.freeze({
  upRight: new OffsetCoords(1, 0, Layouts.evenRow),
  right: new OffsetCoords(1, -1, Layouts.evenRow),
  downRight: new OffsetCoords(0, -1, Layouts.evenRow),
  downLeft: new OffsetCoords(-1, 0, Layouts.evenRow),
  left: new OffsetCoords(-1, 1, Layouts.evenRow),
  upLeft: new OffsetCoords(0, 1, Layouts.evenRow)
});

/*


const Layouts = Enum(
  "oddRow",
  "evenRow",
  "oddCol",
  "evenCol"
);

//aw crap, this might not work...
//TODO
const OddRowDirections = Object.freeze({
  upRight: new OffsetCoords(1, 0, Layouts.oddRow, HexCoords.Orientations.pointyTop),
  right: new OffsetCoords(1, -1, Layouts.oddRow, HexCoords.Orientations.pointyTop),
  downRight: new OffsetCoords(0, -1, Layouts.oddRow, HexCoords.Orientations.pointyTop),
  downLeft: new OffsetCoords(-1, 0, Layouts.oddRow, HexCoords.Orientations.pointyTop),
  left: new OffsetCoords(-1, 1, Layouts.oddRow, HexCoords.Orientations.pointyTop),
  upLeft: new OffsetCoords(0, 1, Layouts.oddRow, HexCoords.Orientations.pointyTop)
});

const EvenRowDirections = Object.freeze({
  upRight: new OffsetCoords(1, 0, Layouts.evenRow, HexCoords.Orientations.pointyTop),
  right: new OffsetCoords(1, -1, Layouts.evenRow, HexCoords.Orientations.pointyTop),
  downRight: new OffsetCoords(0, -1, Layouts.evenRow, HexCoords.Orientations.pointyTop),
  downLeft: new OffsetCoords(-1, 0, Layouts.evenRow, HexCoords.Orientations.pointyTop),
  left: new OffsetCoords(-1, 1, Layouts.evenRow, HexCoords.Orientations.pointyTop),
  upLeft: new OffsetCoords(0, 1, Layouts.evenRow, HexCoords.Orientations.pointyTop)
});

const OddColDirections = Object.freeze({
  upRight: new OffsetCoords(1, 0, Layouts.oddCol, HexCoords.Orientations.flatTop),
  right: new OffsetCoords(1, -1, Layouts.oddCol, HexCoords.Orientations.flatTop),
  downRight: new OffsetCoords(0, -1, Layouts.oddCol, HexCoords.Orientations.flatTop),
  downLeft: new OffsetCoords(-1, 0, Layouts.oddCol, HexCoords.Orientations.flatTop),
  left: new OffsetCoords(-1, 1, Layouts.oddCol, HexCoords.Orientations.flatTop),
  upLeft: new OffsetCoords(0, 1, Layouts.oddCol, HexCoords.Orientations.flatTop)
});

const EvenColDirections = Object.freeze({
  upRight: new OffsetCoords(1, 0, Layouts.evenCol, HexCoords.Orientations.flatTop),
  right: new OffsetCoords(1, -1, Layouts.evenCol, HexCoords.Orientations.flatTop),
  downRight: new OffsetCoords(0, -1, Layouts.evenCol, HexCoords.Orientations.flatTop),
  downLeft: new OffsetCoords(-1, 0, Layouts.evenCol, HexCoords.Orientations.flatTop),
  left: new OffsetCoords(-1, 1, Layouts.evenCol, HexCoords.Orientations.flatTop),
  upLeft: new OffsetCoords(0, 1, Layouts.evenCol, HexCoords.Orientations.flatTop)
});

const Directions = Object.freeze({
  oddRow: OddRowDirections,
  evenRow: EvenRowDirections,
  oddCol: OddRowDirections,
  evenCol: EvenColDirections
});

*/
