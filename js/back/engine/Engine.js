import {StepEvents} from './StepEvents';


const minTimeStep = 5;

export class Engine {
  constructor(time, gameMode) {
    this._gameModel = gameModel;

    this._lastStepEvents = [];
    this._updateTimeStep(0, this._lastStepEvents);
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
    return this._gameModel.getState();
  }
//TODO fix all this
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

    events.forEach((stepEvents) => {
      //console.log(stepEvents);
      eventsState.push(stepEvents.getState())
    });

    return eventsState;
  }

  get systems () {
    return this._systems;
  }

  get time () {
    return this._time;
  }
}
