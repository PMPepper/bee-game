import {Orientations} from "../Orientations";
import {CoordTypes} from "../CoordTypes";

import {AxialCoords} from "./AxialCoords";
import {CubeCoords} from "./CubeCoords";
import {OffsetCoords} from "./OffsetCoords";
import {Directions} from "./Directions";

import {DataPool} from "../../DataPool";

export class HexGrid{
  constructor(cols, rows, coordType = CoordTypes.axial) {

    if(!CoordTypes.isValid(coordType)) {
      throw new TypeError(`Invalid value for argument 'coordType', '${coordType}'`);
    }

    this._cols = cols;
    this._rows = rows;
    this._coordType = coordType;

    switch(this._coordType) {
      case CoordTypes.axial:
        this._hexCoord = AxialCoords;

        this._coordsPool = this._axialCoordsPool = new DataPool(AxialCoords, Math.ceil(cols * rows * 1.1));
        this._cubeCoordsPool = new DataPool(CubeCoords, 100);
        this._offsetCoordsPool = new DataPool(OffsetCoords, 100);
      case CoordTypes.cube:
        this._hexCoord = CubeCoords;

        this._coordsPool = this._cubeCoordsPool = new DataPool(CubeCoords, Math.ceil(cols * rows * 1.1));
        this._axialCoordsPool = new DataPool(Axial, 100);
        this._offsetCoordsPool = new DataPool(OffsetCoords, 100);
      case CoordTypes.offset:
        this._hexCoord = OffsetCoords;

        this._coordsPool = this._offsetCoordsPool = new DataPool(OffsetCoords, Math.ceil(cols * rows * 1.1));
        this._axialCoordsPool = new DataPool(AxialCoords, 100);
        this._cubeCoordsPool = new DataPool(CubeCoords, 100);
    }

    this._data = {};
  }

  //public methods


  //getters/setters
  get cols () {
    return this._cols;
  }

  get rows () {
    return this._rows;
  }

  get coordType () {
    return this._coordType;
  }

  get HexCoords () {
    return this._hexCoord;
  }

  static get AxialCoords () {
    return AxialCoords;
  }

  static get CubeCoords () {
    return CubeCoords;
  }

  static get OffsetCoords () {
    return OffsetCoords;
  }

  static get Directions () {
    return Directions;
  }
}
