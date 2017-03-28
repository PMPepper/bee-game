import {DataPool} from '../../DataPool'
import {DataPools} from "./DataPools";
import {HexCoords} from "./HexCoords";

export class HexCoordOffset {
  constructor(pool) {
    if(!(pool instanceof DataPool)) {
      throw new TypeError('Invalid argument "pool" must be of type DataPool');
    }

    this._pool = pool;
  }

  init(col, row) {
    if(!Number.isInteger(col)) {
      throw new Error( `Invalid Argument: "col" must be an integer, value was "${col}"` );
    }

    if(!Number.isInteger(row)) {
      throw new Error( `Invalid Argument: "row" must be an integer, value was "${row}"` );
    }

    //Axial coords
    this._col = col;
    this._row = row;

    //this._hash = HexCoords.getHashFor(col, row);
  }

  get col () { return this._col; }
  get row () { return this._row; }

  //internal methods
  reset() {
    this._col = null;
    this._row = null;
  }

  //Public methods
  release() {
    this._pool.release(this);
  }

  toString () {
    return `HexCoordOffset {col: ${this.col}, row: ${this.row}, orientation: ${this.orientation}}`;
  }
}
