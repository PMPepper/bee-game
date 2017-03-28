import {Enum} from '../../Enum'
import {Orientations} from '../Orientations'
import {Directions} from './Directions'

//import {HexGrid} from '../HexGrid'

export class HexCoords{
  constructor(grid) {
    /**/if (new.target === HexCoords) {
      throw new TypeError("Cannot construct HexCoords instances directly");
    }

    if(grid && !(grid instanceof HexGrid)) {
      throw new TypeError("Argument 'grid' must be of type 'HexGrid'");
    }

    this._grid = grid;
    this._orientation = Orientations.pointyTop;
    this._neighbours = null;
  }

  get grid () {
    return this._grid;
  }

  get orientation () {
    return this._orientation;
  }

  isNeighbour (coord) {
    throw new Error('Not implemented');
  }

  get neighbours () {
    throw new Error('Not implemented');
  }

  getNeighbour (direction) {
    if(!HexCoords.Directions.isValid(direction)) {
      throw new Error(`Invalid argument 'direction', unknow value '${direction}'`);
    }

    return this.neighbours[direction];
  }

  static get Directions() {
    return Directions;
  }

  static get Orientations() {
    return Orientations;
  }
}
