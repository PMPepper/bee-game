import {DataPool} from './DataPool';

export class KeyValuePair {
  constructor(pool) {
    if(!(pool instanceof DataPool)) {
      throw new TypeError('Invalid argument "pool" must be of type DataPool');
    }

    this._pool = pool;

    Object.preventExtensions(this);
  }

  //Internal/datapool methods
  init(key, value) {
    this._key = key;
    this._value = value;
  }

  reset() {
    this._key = null;
    this._value = null;
  }

  //getters/setters
  get key() {
    return this.key;
  }

  get value() {
    return this.value;
  }

  //public methods
  release() {
    this._pool.release(this);
  }

  valueOf() {
    return this.value;
  }
}
