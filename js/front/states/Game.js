export class Game {
  constructor(time, systems, events) {
    this._time = time;
    this._systems = systems;
    this._events = events;
  }

  get time() {
    return this._time;
  }

  get systems () {
    return this._systems;
  }

  get events () {
    return this._events;
  }
}
