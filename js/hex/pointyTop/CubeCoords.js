import {HexCoords} from "./HexCoords";
import {AxialCoords} from "./AxialCoords";
import {OffsetCoords} from "./OffsetCoords";

export class CubeCoords extends HexCoords{
  constructor(x, y, z, grid) {
    super(grid);

    if(!Number.isInteger(x)) {
      throw new Error( `Invalid Argument: "x" must be an integer, value was "${x}"` );
    }

    if(!Number.isInteger(y)) {
      throw new Error( `Invalid Argument: "y" must be an integer, value was "${y}"` );
    }

    if(!Number.isInteger(z)) {
      throw new Error( `Invalid Argument: "z" must be an integer, value was "${z}"` );
    }

    if(x + y + z !== 0) {
      throw new Error(`Invalid Arguments: "x" + "y" + "z" must equal 0, currently values are ${x} + ${y} + ${z} = ${x+y+z}`);
    }

    this._x = x;
    this._y = y;
    this._z = z;
  }

  get x () {return this._x;}
  get y () {return this._y;}
  get z () {return this._z;}

  add (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "HexCoords"');
    }

    /*if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }*/

    if(!(coord instanceof CubeCoords)) {
      coord = coord.toCubeCoords();
    }

    return new CubeCoords(this.x + coord.x, this.y + coord.y, this.z + coord.z, this.grid);
  }

  subtract (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "HexCoords"');
    }

    /*if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }*/

    if(!(coord instanceof CubeCoords)) {
      coord = coord.toCubeCoords();
    }

    return new CubeCoords(this.x - coord.x, this.y - coord.y, this.z - coord.z, this.grid);
  }

  equals (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "HexCoords"');
    }

    /*if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }*/

    if(!(coord instanceof CubeCoords)) {
      coord = coord.toCubeCoords();
    }

    return this.x === coord.x && this.y == coord.y && this.z == coord.z;
  }

  distanceTo (coord) {
    //TODO
  }

  isNeighbour (coord) {
    if(!coord) {
      throw new Error('Null argument error: coord cannot be null');
    }

    if(!(coord instanceof HexCoords)) {
      throw new Error('Invalid Argument error: Supplied argument must be of type "HexCoords"');
    }

    /*if(this.orientation != coord.orientation) {
        throw new Error('Invalid Argument error: coordinate orientations must match');
    }*/

    if(!(coord instanceof CubeCoords)) {
      coord = coord.toCubeCoords();
    }

    const directions = HexCoords.Directions;
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const tx = coord.x;
    const ty = coord.y;
    const tz = coord.z;

    if(x+1 === tx && y === ty && z-1 == tz) {
      return directions.upRight;
    }

    if(x+1 === tx && y-1 === ty && z == tz) {
      return directions.right;
    }

    if(x === tx && y-1 === ty && z+1 == tz) {
      return directions.downRight;
    }

    if(x-1 === tx && y === ty && z+1 == tz) {
      return directions.downLeft;
    }

    if(x-1 === tx && y+1 === ty && z == tz) {
      return directions.left;
    }

    if(x === tx && y+1 === ty && z-1 == tz) {
      return directions.upLeft;
    }

    //Flat top alternative
    /*} else {
      if(x === tx && y+1 === ty && z-1 == tz) {
        return directions.up;
      }

      if(x+1 === tx && y === ty && z-1 == tz) {
        return directions.upRight;
      }

      if(x+1 === tx && y-1 === ty && z == tz) {
        return directions.downRight;
      }

      if(x === tx && y-1 === ty && z+1 == tz) {
        return directions.down;
      }

      if(x-1 === tx && y === ty && z+1 == tz) {
        return directions.downLeft;
      }

      if(x-1 === tx && y+1 === ty && z == tz) {
        return directions.upLeft;
      }
    }*/

    return false;
  }

  getNeighbours () {
    throw new Error('Not implemented');
  }

  toAxialCoords () {
    return new AxialCoords(this.x, this.z, this.grid);
  }

  toCubeCoords () {
    return this;
  }

  toOffsetCoords () {
    let x = this.x;
    let y = this.y;
    let z = this.z;
    let layouts = OffsetCoords.Layouts;

    switch(layout) {
      /*case layouts.EvenCol:
        return new OffsetCoords(x, z + (x + (x&1)) / 2, layout, this.orientation);
      case layouts.OddCol:
        return new OffsetCoords(x, z + (x - (x&1)) / 2, layout, this.orientation);*/
      case layouts.EvenRow:
        return new OffsetCoords(x + (z + (z&1)) / 2, z, layout, this.orientation);
      case layouts.OddRow:
        return new OffsetCoords(x + (z - (z&1)) / 2, z, layout, this.orientation);
    }

    throw new Error( `Cannot convert to OffsetCoords: Unknown layout "${layout}"` );
  }

  toString () {
    return `CubeCoords {x: ${this.x}, y: ${this.y}, z: ${this.z}, orientation: ${this.orientation}}`;
  }

  get DirectionCoordinateOffsets() {
    return DirectionCoordinateOffsets;
  }

  getDirectionCoordinateOffset(direction) {
    if(!HexCoords.Directions.isValid(direction)) {
      throw new Error(`Invalid argument 'direction', unknow value '${direction}'`);
    }

    return DirectionCoordinateOffsets[direction];
  }
}

const DirectionCoordinateOffsets = Object.freeze({
  upRight: new CubeCoords(1, 0, -1),
  right: new CubeCoords(1, -1, 0),
  downRight: new CubeCoords(0, -1, 1),
  downLeft: new CubeCoords(-1, 0, 1),
  left: new CubeCoords(-1, 1, 0),
  upLeft: new CubeCoords(0, 1, -1)
});

/*const FlatTopDirections = Object.freeze({
  up: new CubeCoords(0, 1, -1),
  upRight: new CubeCoords(1, 0, -1),
  downRight: new CubeCoords(1, -1, 0),
  down: new CubeCoords(0, -1, 1),
  downLeft: new CubeCoords(-1, 0, 1),
  upLeft: new CubeCoords(-1, 1, 0)
});*/
