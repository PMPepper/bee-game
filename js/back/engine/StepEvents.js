export class StepEvents {
  constructor(time) {
    this._time = time;
    this._events = [];
  }

  get time() {
    return this._time;
  }

  get events () {
    return this._events;
  }

  getState() {
    const eventsState = [];
    this.events.forEach((event) => {
      eventsState.push(event.getState());
    });

    return {
      'class': 'StepEvents',
      time: this.time,
      events: eventsState
    };
  }
}
