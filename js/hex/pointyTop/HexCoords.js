import {Enum} from '../../Enum'
import {DataPool} from '../../DataPool'
import {DataPools} from "./DataPools";
import {Orientations} from '../Orientations'
import {Directions} from './Directions'

import {HexGrid} from './HexGrid'
import {HexCoordOffset} from './HexCoordOffset'

export class HexCoords{
  constructor(pool) {
    if(!(pool instanceof DataPool)) {
      throw new TypeError('Invalid argument "pool" must be of type DataPool');
    }

    this._data = {};
    this._modules = {};

    this._pool = pool;
  }

  init(col, row, grid) {
    if(grid && !(grid instanceof HexGrid)) {
      throw new TypeError("Argument 'grid' must be of type 'HexGrid'");
    }

    if(!Number.isInteger(col)) {
      throw new Error( `Invalid Argument: "col" must be an integer, value was "${col}"` );
    }

    if(!Number.isInteger(row)) {
      throw new Error( `Invalid Argument: "row" must be an integer, value was "${row}"` );
    }

    //Axial coords
    this._col = col;
    this._row = row;

    this._hash = HexCoords.getHashFor(col, row);

    //Other stuff

    this._grid = grid;
    this._orientation = Orientations.pointyTop;
    this._neighbours = null;
  }

  get col () { return this._col; }
  get row () { return this._row; }

  //Cube coords
  get x () { return this._col; }
  get y () { return this._row; }
  get z () { return -this.col-this.row; }

  get hash () { return this._hash; }

  get data () { return this._data; }
  get modules () { return this._modules; }

  get grid () { return this._grid; }
  get orientation () { return this._orientation; }

  //internal methods
  reset() {
    this._col = null;
    this._row = null;

    this._hash = null;

    this._data = null;
    this._modules = null;

    const data = this._data;
    const modules = this._modules;

    for(let key in data) {
      delete data[key];
    }

    for(let key in modules) {
      delete modules[key];
    }

    this._grid = null;
    this._orientation = null;
    this._neighbours = null;
  }

  //Public methods
  release() {
    this._pool.release(this);
  }

  add (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords) && !(coord instanceof HexCoordOffset)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords" or "pointyTop.HexCoordOffset"');
    }

    return DataPools.coordsPool.take(this.col + coord.col, this.row + coord.row, this.grid);
  }

  subtract (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords) && !(coord instanceof HexCoordOffset)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords" or "pointyTop.HexCoordOffset"');
    }

    return DataPools.coordsPool.take(this.col - coord.col, this.row - coord.row, this.grid);
  }

  equals (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords"');
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

    const abs = Math.abs;

    return (abs(this.col - coord.col)
          + abs(this.col + this.row - coord.col - coord.row)
          + abs(this.row - coord.row)) / 2;
  }

  isNeighbour (coord, direction = null) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords"');
    }

    if(direction != null) {
      if(!HexCoords.Directions.isValid(direction)) {
        throw new TypeError(`Argument 'direction' is not a valid value: '${direction}'`);
      }

      return coord.equals(this.add(HexGrid.getDirectionCoordOffset(direction)));
    }

    //is this coord a neighbour in ANY direction
    for(let direction in HexCoords.Directions) {
      if(coord.equals(this.add(HexGrid.getDirectionCoordOffset(direction)))) {
        return direction;//return which direction this neighbour is in
      }
    }

    return false;
  }

  get neighbours () {
    let neighbours = this._neighbours;

    //only ever need to calculate neighbours once
    if(neighbours == null) {
      neighbours = this._neighbours = {};

      for(let direction in HexCoords.Directions) {
        let neighbour = this.add(HexGrid.getDirectionCoordOffset(direction));

        //If a grid is specified, check if the potential neighbour is contained within it
        if(!this.grid || this.grid.contains(neighbour)) {
          neighbours[direction] = neighbour;
        } else {
          neighbours[direction] = null;
        }
      }

      Object.freeze(neighbours);
    }

    return neighbours;
  }

  getNeighbour (direction) {
    if(!HexCoords.Directions.isValid(direction)) {
      throw new Error(`Invalid argument 'direction', unknow value '${direction}'`);
    }

    return this.neighbours[direction];
  }

  toString () {
    return `HexCoords {col: ${this.col}, row: ${this.row}, orientation: ${this.orientation}}`;
  }

  static get HexCoords() {
    return HexCoords;
  }

  static get Directions() {
    return Directions;
  }

  static get Orientations() {
    return Orientations;
  }

  static getHashFor(col, row) {
    return col+','+row;
  }
}

/*class Neighbours {
  constructor() {

    Object.freeze(this);
  }

  forEach(callback) {

  }
}*/
