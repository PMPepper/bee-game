//TODO needs more thought...

export class DataPools {
  constructor(initial = 100, type = null) {
    if(!Number.isInteger(initial) || initial < 0) {
      throw new TypeError("Argument 'initial' must be a positive integer or zero");
    }

    this._data = new Array(initial);
    this._type = type;
  }
}
