//TODO needs more thought...

export class DataPool {
  constructor(type, initial = 100, max = 0, options = null) {
    if(!Number.isInteger(initial) || initial < 0) {
      throw new TypeError("Argument 'initial' must be a positive integer or zero");
    }

    this._data = new Array(initial);
    this._type = type;
    this._max = max;
    this._tracking = [];

    options = options || {};

    this._new = options.create ? options.create : () => {
      return new this._type(this);
    };

    this._release = options.release ? options.release : (obj) => {
      obj.reset();
    };

    this._init = options.init ? options.init : (obj, args) => {
      obj.init.apply(obj, args);
    };

    //Actually create the initial objects
    for(let i = 0; i < initial; i++) {
      this._data[i] = this._new();
    }
  }

  take (...args) {
    const data = this._data;
    let obj = null;

    if(data.length > 0) {
      obj = data.pop();
    } else {
      obj = this._new();
    }

    this._init(obj, args);

    //add to tracking
    if(this.isTracking) {
      this._tracking[this._tracking.length - 1].push(obj);
    }

    return obj;
  }

  release (obj) {
    const data = this._data;

    if(this.isTracking) {
      this.exclude(obj);
    }

    this._release(obj);

    if(this.max === 0 || data.length < this.max) {
      data[data.length] = obj;
    }
  }

  startTracking() {
    this._tracking.push([]);
  }

  endTracking() {
    if(this.isTracking) {
      this._tracking.pop();
    }
  }

  endTrackingAndRelease() {
    if(!this.isTracking) {
      return;
    }

    this.releaseTracked();
    this.endTracking();
  }

  exclude(obj) {
    if(!this.isTracking) {
      return;
    }

    const tracking = this._tracking;

    for( let i = 0; i < tracking.length; i++) {
      let tracked = tracking[i];

      for( let j = 0; j < tracked.length; j++) {

        if(tracked[j] == obj) {
          tracked.splice(j, 1);

          return;
        }
      }
    }
  }

  releaseTracked() {
    if(!this.isTracking) {
      return;
    }

    const tracking = this._tracking;
    const tracked = tracking[tracking.length];

    tracked.forEach((obj)=> {
      this.release(obj);
    });

    tracked.length = 0;
  }

  //getters/setters
  get max() {
    return this._max;
  }

  get isTracking() {
    return this._tracking.length > 0;
  }
}
