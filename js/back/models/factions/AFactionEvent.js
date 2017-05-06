export class AFactionEvent {
  constructor(time) {
    this._time = time;

    if(new.constructor == AFactionEvent) {
      throw new Event('AFactionEvent cannot be instanciated directly');
    }
  }

  get time() {
    return this._time;
  }

  getState() {
    return {
      time: this.time,
    };
  }
}
