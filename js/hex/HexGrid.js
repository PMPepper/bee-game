import {Orientations} from "./Orientations";

//flat top
//TODO implement
/*import {FlatTopAxialCoords} from "./flatTop/AxialCoords";
import {FlatTopCubeCoords} from "./flatTop/CubeCoords";
import {FlatTopOffsetCoords} from "./flatTop/OffsetCoords";*/
import {FlatTopDirections} from "./flatTop/Directions";
//import {FlatTop} from "./flatTop/";

//pointy top
import {PointyTopAxialCoords} from "./pointyTop/AxialCoords";
import {PointyTopCubeCoords} from "./pointyTop/CubeCoords";
import {PointyTopOffsetCoords} from "./pointyTop/OffsetCoords";
import {PointyTopDirections} from "./pointyTop/Directions";
//import {PointyTop} from "./pointyTop/";

export class HexGrid{
  constructor(cols, rows, orientation = Orientations.pointyTop) {

    this._cols = cols;
    this._rows = rows;
    this._orientation = orientation;

    //constructor cache
    const isPointTop  = orientation == Orientations.pointyTop;

    this._axialCoords = isPointTop ? PointyTopAxialCoords : FlatTopAxialCoords ;
    this._cubeCoords = isPointTop ? PointyTopCubeCoords : FlatTopCubeCoords ;
    this._offsetCoords = isPointTop ? PointyTopOffsetCoords : FlatTopOffsetCoords ;
    this._directions = isPointTop ? PointyTopDirections : FlatTopDirections ;
  }

  //getters/setters
  get cols () {
    return this._cols;
  }

  get rows () {
    return this._rows;
  }

  get orientation () {
    return this._orientation;
  }

  get AxialCoords () {
    return this._axialCoords;
  }

  get CubeCoords () {
    return this._cubeCoords;
  }

  get OffsetCoords () {
    return this._offsetCoords;
  }

  get Directions () {
    return this._directions;
  }
}
