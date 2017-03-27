import {Enum} from '../Enum.js'

import {HexCoords} from "./HexCoords";
import {AxialCoords} from "./AxialCoords";
import {CubeCoords} from "./CubeCoords";

export class OffsetCoords extends HexCoords{
  constructor(col, row, layout = Layouts.oddRow, orientation) {
    super(orientation);

    if(!Number.isInteger(col)) {
      throw new Error( `Invalid Argument: "col" must be an integer, value was "${col}"` );
    }

    if(!Number.isInteger(row)) {
      throw new Error( `Invalid Argument: "row" must be an integer, value was "${row}"` );
    }

    //TODO restrict layouts based on orientation
    if(!(layout in Layouts)) {
      throw new Error( `Invalid Argument: Invalid layout "${layout}"` );
    }

    if(!OffsetCoords.isValidLayout(this.orientation, layout)) {
        throw new Error( `Invalid Arguments: Invalid orientation/layout combination "${this.orientation}"/"${layout}"` );
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
      throw new Error('Invalid Argument error: Supplied argument must be of type "HexCoords"');
    }

    if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }

    if(!(coord instanceof OffsetCoords) || this.layout != coord.layout) {
      coord = coord.toOffsetCoords(this.layout);
    }

    return new OffsetCoords(this.col + coord.col, this.row + coord.row, this.layout, this.orientation);
  }

  subtract (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "HexCoords"');
    }

    if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }

    if(!(coord instanceof OffsetCoords) || this.layout != coord.layout) {
      coord = coord.toOffsetCoords(this.layout);
    }

    return new OffsetCoords(this.col - coord.col, this.row - coord.row, this.layout, this.orientation);
  }

  equals (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "HexCoords"');
    }

    if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }

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
      throw new Error('Invalid Argument error: Supplied argument must be of type "HexCoords"');
    }

    if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }

    //TODO
  }

  isNeighbour (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "HexCoords"');
    }

    if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }

    throw new Error('Not implemented');
  }

  getNeighbours () {
    throw new Error('Not implemented');
  }

  getNeighbour (direction) {
    throw new Error('Not implemented');
  }

  toAxialCoords () {
    let x;//Cube coords
    let z;
    const col = this.col;
    const row = this.row;

    switch(this.layout) {
      case Layouts.evenCol:
        x = col;
        z = row - (col + (col&1)) / 2;
        break;
      case Layouts.oddCol:
        x = col;
        z = row - (col - (col&1)) / 2;
        break;
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
    return new AxialCoords(x, z, this.orientation);
  }

  toCubeCoords () {
    let x;
    let y;
    let z;
    const col = this.col;
    const row = this.row;

    switch(this.layout) {
      case Layouts.evenCol:
        x = col;
        z = row - (col + (col&1)) / 2;
        y = -x-z;
        break;
      case Layouts.oddCol:
        x = col;
        z = row - (col - (col&1)) / 2;
        y = -x-z;
        break;
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

    return new CubeCoords(x, y, z, this.orientation);
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
      case layouts.EvenCol:
        x = col;
        z = row - (col + (col&1)) / 2;
        y = -x-z;
        break;
      case layouts.OddCol:
        x = col;
        z = row - (col - (col&1)) / 2;
        y = -x-z;
        break;
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
      case layouts.EvenCol:
        return new OffsetCoords(x, z + (x + (x&1)) / 2, layout, this.orientation);
      case layouts.OddCol:
        return new OffsetCoords(x, z + (x - (x&1)) / 2, layout, this.orientation);
      case layouts.EvenRow:
        return new OffsetCoords(x + (z + (z&1)) / 2, z, layout, this.orientation);
      case layouts.OddRow:
        return new OffsetCoords(x + (z - (z&1)) / 2, z, layout, this.orientation);
    }

    throw new Error( `Cannot convert to OffsetCoords: Unknown layout "${layout}"` );
  }

  toString () {
    return `OffsetCoords {col: ${this.col}, row: ${this.row}, layout: ${this.layout}, orientation: ${this.orientation}}`;
  }

  get directions() {
    return Directions[this.layout];
  }

  static getDirections (layout) {
    if(!Layouts.isValid(layout)) {
      throw new Error(`Argument error: Invalid layout "${layout}`);
    }

    return Directions[layout];
  };

  static get Layouts () {
    return Layouts;
  }

  static isValidLayout(orientation, layout) {
    if(!HexCoords.Orientations.isValid(orientation)) {
      throw new Error(`Invalid Argument: Invalid orientation "${orientation}`);
    }

    if(!Layouts.isValid(layout)) {
      throw new Error(`Argument error: Invalid layout "${layout}`);
    }

    return (orientation === HexCoords.Orientations.pointyTop) ?
      layout == Layouts.oddRow || layout == Layouts.evenRow
      :
      layout == Layouts.oddCol || layout == Layouts.evenCol
  }
}

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
