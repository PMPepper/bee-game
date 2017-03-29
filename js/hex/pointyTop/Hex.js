import {DataPool} from '../../DataPool';
import {DataPools} from "./DataPools";
import {Directions} from './Directions';

import {HexGrid} from './HexGrid';
import {HexCoords} from './HexCoords';

export class Hex extends HexCoords{
  constructor(pool) {
    super(pool);

    this._data = {};
    this._modules = {};

    this._upRightNeighbour = undefined;
    this._rightNeighbour = undefined;
    this._downRightNeighbour = undefined;
    this._downLeftNeighbour = undefined;
    this._leftNeighbour = undefined;
    this._upLeftNeighbour = undefined;

    this._neighbours = new HexNeighbours(this);
  }

  init(col, row, grid) {
    if(!Number.isInteger(col)) {
      throw new Error( `Invalid Argument: "col" must be an integer, value was "${col}"` );
    }

    if(!Number.isInteger(row)) {
      throw new Error( `Invalid Argument: "row" must be an integer, value was "${row}"` );
    }
    
    if(grid && !(grid instanceof HexGrid)) {
      throw new TypeError("Argument 'grid' must be of type 'HexGrid'");
    }

    super.init(col, row);

    this._grid = grid;
  }

  get data () { return this._data; }
  get modules () { return this._modules; }

  get grid () { return this._grid; }

  get upRightNeighbour() {
    if(this._upRightNeighbour === undefined) {
      this._upRightNeighbour = this._grid.getHexAt(this.getNeighbouringCoord(Directions.upRight));
    }
    return this._upRightNeighbour;
  }

  get rightNeighbour() {
    if(this._rightNeighbour === undefined) {
      this._rightNeighbour = this._grid.getHexAt(this.getNeighbouringCoord(Directions.right));
    }

    return this._rightNeighbour;
  }

  get downRightNeighbour() {
    if(this._downRightNeighbour === undefined) {
      this._downRightNeighbour = this._grid.getHexAt(this.getNeighbouringCoord(Directions.downRight));
    }

    return this._downRightNeighbour;
  }

  get downLeftNeighbour() {
    if(this._downLeftNeighbour === undefined) {
      this._downLeftNeighbour = this._grid.getHexAt(this.getNeighbouringCoord(Directions.downLeft));
    }

    return this._downLeftNeighbour;
  }

  get leftNeighbour() {
    if(this._leftNeighbour === undefined) {
      this._leftNeighbour = this._grid.getHexAt(this.getNeighbouringCoord(Directions.left));
    }

    return this._leftNeighbour;
  }

  get upLeftNeighbour() {
    if(this._upLeftNeighbour === undefined) {
      this._upLeftNeighbour = this._grid.getHexAt(this.getNeighbouringCoord(Directions.upLeft));
    }

    return this._upLeftNeighbour;
  }

  //internal methods
  reset() {
    super.reset();

    const data = this._data;
    const modules = this._modules;

    for(let key in data) {
      delete data[key];
    }

    for(let key in modules) {
      delete modules[key];
    }

    this._grid = null;

    this._upRightNeighbour = undefined;
    this._rightNeighbour = undefined;
    this._downRightNeighbour = undefined;
    this._downLeftNeighbour = undefined;
    this._leftNeighbour = undefined;
    this._upLeftNeighbour = undefined;
  }

  //Public methods
  release() {
    this._pool.release(this);
  }

  isNeighbour (hex, direction = null) {
    if(!hex) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(hex instanceof Hex)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "pointyTop.Hex"');
    }

    if(hex.grid != this.grid) {
      throw new Error('Invalid Argument error: Supplied hex must be part of the same grid');
    }

    if(direction != null) {
      if(!HexCoords.Directions.isValid(direction)) {
        throw new TypeError(`Argument 'direction' is not a valid value: '${direction}'`);
      }

      return hex == this.getNeighbour(direction);
    }

    //is this coord a neighbour in ANY direction
    const neighbours = this.neighbours;

    for(let direction in neighbours) {
      if(neighbours[direction] == hex) {
        return direction;
      }
    }

    return false;
  }

  getNeighbour(direction) {
    if(!Directions.isValid(direction)) {
      throw new TypeError(`Argument 'direction' is not a valid value: '${direction}'`);
    }

    switch(direction) {
      case Directions.upRight:
        return this.upRightNeighbour;
      case Directions.right:
        return this.rightNeighbour;
      case Directions.downRight:
        return this.downRightNeighbour;
      case Directions.downLeft:
        return this.downLeftNeighbour;
      case Directions.left:
        return this.leftNeighbour;
      case Directions.upLeft:
        return this.upLeftNeighbour;
    }
  }

  get neighbours () {
    return this._neighbours;
  }


  toString () {
    return `HexCoords {col: ${this.col}, row: ${this.row}, orientation: ${this.orientation}}`;
  }

  toCoord () {
    return DataPools.coordsPool.take(this.col, this.row);
  }

  static get Directions() {
    return Directions;
  }

  static get Orientations() {
    return Orientations;
  }
}

class HexNeighbours {
  constructor(hex) {
    this._hex = hex;

    Object.defineProperty( this, 'upRight',   {enumerable: true, get: () => { return this._hex.upRightNeighbour; } });
    Object.defineProperty( this, 'right',     {enumerable: true, get: () => { return this._hex.rightNeighbour; } });
    Object.defineProperty( this, 'downRight', {enumerable: true, get: () => { return this._hex.downRightNeighbour; } });
    Object.defineProperty( this, 'downLeft',  {enumerable: true, get: () => { return this._hex.downLeftNeighbour; } });
    Object.defineProperty( this, 'left',      {enumerable: true, get: () => { return this._hex.leftNeighbour; } });
    Object.defineProperty( this, 'upLeft',    {enumerable: true, get: () => { return this._hex.upLeftNeighbour; } });

    Object.freeze(this);
  }

//not working, for some reason
  /** [Symbol.iterator]() {
      yield upRight;
      yield right;
      yield downRight;
      yield downLeft;
      yield left;
      yield upLeft;
  }*/
}
