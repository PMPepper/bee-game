import {HexGrid} from "./HexGrid";


export class RenderHex {
  constructor(grid) {
    if(!(grid instanceof HexGrid)) {
      throw new TypeError('Invalid argument for "grid", must be of type "HexGrid"');
    }

    this._grid = grid;
  }

  get grid () {
    return this._grid;
  }

  render (x, y) {
    throw new Error('Not implemented');
  }
}
