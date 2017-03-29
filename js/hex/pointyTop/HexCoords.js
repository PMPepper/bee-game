import {DataPool} from '../../DataPool'
import {VarHelpers} from '../../VarHelpers'
import {DataPools} from "./DataPools";
import {Orientations} from '../Orientations'
import {Directions} from './Directions'

const sqrt3 = Math.sqrt(3);

export class HexCoords{
  constructor(pool) {
    if(!(pool instanceof DataPool)) {
      throw new TypeError('Invalid argument "pool" must be of type DataPool');
    }

    this._orientation = Orientations.pointyTop;

    this._pool = pool;
  }

  init(col, row) {
    //Does this need to be an integer?
    if(!VarHelpers.isNumber(+col)) {
      throw new Error( `Invalid Argument: "col" must be an integer, value was "${col}"` );
    }

    if(!VarHelpers.isNumber(+row)) {
      throw new Error( `Invalid Argument: "row" must be an integer, value was "${row}"` );
    }

    //Axial coords
    this._col = +col;
    this._row = +row;

    this._hash = HexCoords.getHashFor(col, row);
  }

  get col () { return this._col; }
  get row () { return this._row; }

  //Cube coords
  get x () { return this._col; }
  get y () { return this._row; }
  get z () { return -this.col-this.row; }

  get x2d() {
    return (this.col + (this.row * 0.5))*sqrt3;
  }

  get y2d() {
    return this.row * 1.5;
  }

  get hash () { return this._hash; }

  get orientation () { return this._orientation; }

  //internal methods
  reset() {
    this._col = null;
    this._row = null;

    this._hash = null;
  }

  //Public methods
  release() {
    this._pool.release(this);
  }

  add (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new TypeError('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords"');
    }

    return DataPools.coordsPool.take(this.col + coord.col, this.row + coord.row);
  }

  subtract (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new TypeError('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords"');
    }

    return DataPools.coordsPool.take(this.col - coord.col, this.row - coord.row);
  }

  equals (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new TypeError('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords"');
    }

    return this.col === coord.col && this.row == coord.row;
  }

  round() {
    var rx = Math.round(this.x)
    var ry = Math.round(this.y)
    var rz = Math.round(this.z)

    var xDiff = Math.abs(rx - this.x)
    var yDiff = Math.abs(ry - this.y)
    var zDiff = Math.abs(rz - this.z)

    if( xDiff > yDiff && xDiff > zDiff ) {
        rx = -ry-rz;
    } else if (yDiff > zDiff) {
        ry = -rx-rz;
    } else {
        rz = -rx-ry;
    }
    return DataPools.coordsPool.take(rx, ry);
  }

  distanceTo (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new TypeError('Invalid Argument error: Supplied argument must be of type "pointyTop.HexCoords"');
    }

    const abs = Math.abs;

    return (abs(this.col - coord.col)
          + abs(this.col + this.row - coord.col - coord.row)
          + abs(this.row - coord.row)) / 2;
  }

  isNeighbour(coord) {
    return this.distanceTo(coord) == 1;
  }

  getNeighbouringCoord (direction) {
    if(!HexCoords.Directions.isValid(direction)) {
      throw new Error(`Invalid argument 'direction', unknow value '${direction}'`);
    }

    return this.add(HexCoords.getDirectionCoordOffset(direction));
  }

  getNeighbouringCoords () {
    result = {};

    for(let direction in Directions) {
      result[direction] = getNeighbouringCoord(direction);
    }

    return result;
  }

  getNeighbouringCoordsAsArray() {
    result = [];

    for(let direction in Directions) {
      result.push(getNeighbouringCoord(direction));
    }

    return result;
  }

  toString () {
    return `HexCoords {col: ${this.col}, row: ${this.row}, orientation: ${this.orientation}}`;
  }

  static from2dCoords(x, y, size) {
      let col = (x * Math.sqrt(3)/3 - y / 3) / size;
      let row = y * 2/3 / size;
      let h1 = DataPools.coordsPool.take(col, row);
      let h2 = h1.round();

      h1.release();

      return h2;
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

  static get directionCoordOffsets() {
    if(!isDirectionsCoordOffsetInited) {
      isDirectionsCoordOffsetInited = true;

      DirectionCoordOffsets.upRight   = DataPools.coordsPool.take(1, -1);
      DirectionCoordOffsets.right     = DataPools.coordsPool.take(1, 0);
      DirectionCoordOffsets.downRight = DataPools.coordsPool.take(0, 1);
      DirectionCoordOffsets.downLeft  = DataPools.coordsPool.take(-1, 1);
      DirectionCoordOffsets.left      = DataPools.coordsPool.take(-1, 0);
      DirectionCoordOffsets.upLeft    = DataPools.coordsPool.take(0, -1);

      Object.freeze(DirectionCoordOffsets);
    }

    return DirectionCoordOffsets;
  }

  static getDirectionCoordOffset(direction) {

    if(!HexCoords.Directions.isValid(direction)) {
      throw new Error(`Invalid argument 'direction', unknow value '${direction}'`);
    }

    return HexCoords.directionCoordOffsets[direction];
  }
}

let isDirectionsCoordOffsetInited = false;
const DirectionCoordOffsets = {};
