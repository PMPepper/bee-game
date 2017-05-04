import {StepEvents} from './StepEvents';


const minTimeStep = 5;

export class Engine {
  constructor(gameModel) {
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

  _updateTimeStep(timeStep, events) {
    const oldTime = this._gameModel.time;
    const newTime = oldTime + timeStep;

    const stepEvents = new StepEvents(newTime);
    events.push(stepEvents);

    this._gameModel.update(newTime, stepEvents);

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
