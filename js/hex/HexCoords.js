import {Enum} from '../Enum.js'

export class HexCoords{
  constructor(orientation = Orientations.pointyTop) {
    if (new.target === HexCoords) {
      throw new TypeError("Cannot construct HexCoords instances directly");
    }

    if(!Orientations.isValid(orientation)) {
      throw new TypeError(`Invalid Argument: Invalid orientation "${orientation}"`);
    }

    this._orientation = orientation;
  }

  get orientation () {
    return this._orientation;
  }

  isNeighbour (coord) {
    throw new Error('Not implemented');
  }

  getNeighbours () {
    throw new Error('Not implemented');
  }

  getNeighbour (direction) {
    throw new Error('Not implemented');
  }

  static getDirections(orientation = Orientations.pointyTop) {
    if(!Orientations.isValid(orientation)) {
      throw new Error(`Invalid Argument: Invalid orientation "${orientation}`);
    }

    return orientation === Orientations.pointyTop ? PointyTopDirections : FlatTopDirections;
  }

  static get Orientations() {
    return Orientations;
  }

  static isDirection(orientation, direction) {
    if(!Orientations.isValid(orientation)) {
      throw new Error(`Invalid Argument: Invalid orientation "${orientation}`);
    }

    return direction in HexCoords.getDirections(orientation);
  }
}


const FlatTopDirections = Enum(
  'up',
  'upRight',
  'downRight',
  'down',
  'downLeft',
  'upLeft');

const PointyTopDirections = Enum(
  'upRight',
  'right',
  'downRight',
  'downLeft',
  'left',
  'upLeft');

const Orientations = Enum(
  'pointyTop',
  'flatTop'
);
