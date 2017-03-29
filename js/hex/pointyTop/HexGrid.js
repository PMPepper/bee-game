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

    //For some reason the class syntax isn't working!
    this.isInGrid = (col, row) => {
      if(arguments.length == 1 && (arguments[0] instanceof HexCoords)) {
        col = arguments[0].col;
        row = arguments[0].row;
      }

      return !!this._data[HexCoords.getHashFor(col, row)];
    }

    /*this.getHexAt = (col, row) => {
      if(arguments.length == 1 && (arguments[0] instanceof HexCoords)) {
        col = arguments[0].col;
        row = arguments[0].row;
      }

      return (this._data[HexCoords.getHashFor(col, row)]) || null;
    }*/

    this.getHexes = (...coords) => {
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
  }

  //public methods
  getHexAt (col, row) {
    if(arguments.length == 1 && (arguments[0] instanceof HexCoords)) {
      col = arguments[0].col;
      row = arguments[0].row;
    }

    return (this._data[HexCoords.getHashFor(col, row)]) || null;
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

    //TODO

    /*for() {

    }*/

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
