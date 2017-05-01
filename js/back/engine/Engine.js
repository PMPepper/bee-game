import {StepEvents} from './StepEvents';


const minTimeStep = 5;

export class Engine {
  constructor(time, systems) {
    this._systems = systems;
    this._time = time;

    this._lastStepEvents = null;
  }

  update(deltaTime) {
    const updateSteps = Math.max( 1, Math.floor(deltaTime / minTimeStep) );

    const events = [];

    for( let i = 0; i < updateSteps; i++) {
      if(!this._updateTimeStep(minTimeStep, events)) {
        break;
      }
    }

    this._lastStepEvents = events;

    return this.getState();
  }

  getState() {
    const systems = [];

    this.systems.forEach((system) => {
      systems.push(system.getState());
    });

    return {
      'class': 'Engine',
      time: this.time,
      systems: systems,
      events: this._getEventsState()
    };
  }

  _updateTimeStep(timeStep, events) {
    const oldTime = this.time;
    const newTime = oldTime + timeStep;

    this._time = newTime;

    const stepEvents = new StepEvents(newTime);
    events.push(stepEvents);

    this.systems.forEach((system) => {system.update(newTime, stepEvents)});

    return true;
  }

  _getEventsState() {
    const eventsState = [];
    const events = this._lastStepEvents;

    events.forEach((stepEvents) => {events.push(stepEvents.getState())});

    return eventsState;
  }

  get systems () {
    return this._systems;
  }

  get time () {
    return this._time;
  }
}
