import {Orientations} from "../Orientations";

import {Directions} from "./Directions";
import {DataPools} from "./DataPools";
import {HexCoords} from "./HexCoords";
import {Hex} from "./Hex";

export class HexGrid {
  constructor(shape, firstColumn) {
    if(!shape || !(shape instanceof Array)) {
      throw new TypeError('Invalid argument for "shape", must be of type "Array"');
    }

    if(!firstColumn || !(firstColumn instanceof Array)) {
      throw new TypeError('Invalid argument for "firstColumn", must be of type "Array"');
    }

    const data = this._data = {};
    this._cols = 0;
    this._rows = shape.length;


    const start = shape.start || 0;
    let count = 0;
    let colNum = 0;
    let rowNum = 0;
    let row = null;
    let maxColumns

    for(let i = 0; i < shape.length; i++) {
      colNum = firstColumn[i];
      rowNum = i + start;
      row = shape[i];

      for( let j = 0; j < row.length; j++) {
        if(row[j]) {
          let coord = DataPools.hexPool.take(colNum, rowNum, this);
          data[coord.hash] = coord;
          count++;
        }

        colNum++;
      }
    }

    this._count = count;
  }

  //public methods
  isInGrid(col, row) {
    if(arguments.length == 1) {
      if(!(arguments[0] instanceof HexCoords)) {
        throw new TypeError('Invalid argument, if single argument must be instance of HexCoords object');
      }

      if((arguments[0] instanceof Hex) && arguments[0].grid != this) {
        throw new Error('Invalid Argument error: Supplied Hex object must be part of this grid');
      }

      col = arguments[0].col;
      row = arguments[0].row;
    } else {
      if( !Number.isInteger(col)) {
        throw new TypeError(`Invalid argument, "col" must be an integer, value supplied was "${col}"`);
      }

      if( !Number.isInteger(row)) {
        throw new TypeError(`Invalid argument, "row" must be an integer, value supplied was "${row}"`);
      }
    }

    return !!this._data[HexCoords.getHashFor(col, row)];
  }

  getHexAt (col, row) {
    if(arguments.length == 1) {
      if(!(arguments[0] instanceof HexCoords)) {
        throw new TypeError('Invalid argument, if single argument must be instance of HexCoords object');
      }
      col = arguments[0].col;
      row = arguments[0].row;
    } else {
      if( !Number.isInteger(col)) {
        throw new TypeError(`Invalid argument, "col" must be an integer, value supplied was "${col}"`);
      }

      if( !Number.isInteger(row)) {
        throw new TypeError(`Invalid argument, "row" must be an integer, value supplied was "${row}"`);
      }
    }

    return (this._data[HexCoords.getHashFor(col, row)]) || null;
  }

  getHexes (...coords)  {
    if(coords.length == 1 && (coords[0] instanceof Array)) {
      coords = coords[0];
    }

    const results = [];

    for(var i = 0; i < coords.length; i++ ) {
      let coord = coords[i];

      if(!(coord instanceof HexCoords)) {
        throw new TypeError('Invalid value in coords list, must be of type "HexCoords"');
      }

      results.push(this.getHexAt(coord));
    }

    return results;
  }

  forEach(callback) {
    const data = this._data;

    for(let hash in data) {
      callback(data[hash]);
    }
  }

  lineTo (start, end) {
    if(!(start instanceof HexCoords)) {
      throw new TypeError('Invalid argument for "start", must be of type "HexCoords"');
    }

    if(!(end instanceof HexCoords)) {
      throw new TypeError('Invalid argument for "end", must be of type "HexCoords"');
    }

    const distance = start.distanceTo(end);
    const results = [];

    function lerp(a, b, t) { // for floats
      return a + (b - a) * t
    }

    function cubeLerp(a, b, t){ // for hexes
      return DataPools.coordsPool.take(
        lerp(a.x, b.x, t),
        lerp(a.y, b.y, t));
    }

    for(let i = 0; i < distance; i++) {
      let fractionCoord = cubeLerp(start, end, 1.0/distance * i);
      let roundedCoord = fractionCoord.round();

      results.push(this.getHexAt(roundedCoord));

      fractionCoord.release();
      roundedCoord.release();
    }

    return results;
  }

  //getters/setters
  get cols() { return this._cols; }
  get rows() { return this._rows; }
  get count() { return this._count; }

  //static methods
  static get HexCoords () {
    return HexCoords;
  }

  static get Directions () {
    return Directions;
  }

  //-Factory methods
  static createRectangle(cols, rows, startCol = 0, startRow = 0) {
    const shape = [];
    const firstColumn = [];

    shape.start = startRow;

    let colNum = 0;
    let rowNum = 0;
    let row = null;

    for(let i = 0; i < rows; i++) {
      rowNum = i + startRow;
      colNum = -Math.floor(rowNum/2);
      row = [];
      shape.push(row);
      firstColumn.push(colNum);

      for( let j = 0; j < cols; j++) {
        row[j] = true;

        colNum++;
      }
    }

    return new HexGrid(shape, firstColumn);
  }
}

DataPools.init();
