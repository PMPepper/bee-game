import {Factory} from './../states/Factory';
import React from 'react';
import {render} from 'react-dom';


//import {Window} from '../interface/Window.jsx';
//import {Windowing} from '../interface/Windowing.jsx';

import {SystemView} from '../interface/SystemView.jsx';

export class Client {
  constructor($element) {
    this._$element = $element;
    this._connector = null;
    this._state;

    this._isPaused = false;
    this._playSpeed = 500;//seconds per update
    this._isAwaitingEngineUpdate = false;

    this._isDestroyed = false;

    this.tick = this.tick.bind(this);

  }

  update(newStateObj) {
    this._isAwaitingEngineUpdate = false;
    this._getStateFromObj(newStateObj);

    this._systemView = render(<SystemView selecteSystemIndex="0" gameState={this._state} />, this.$element[0]);
  }

  _getStateFromObj(newStateObj) {
    this._state = Factory.getState(newStateObj);
  }

  tick () {
    if(this._isDestroyed) {
      return;
    }

    if(!this._isPaused && !this._isAwaitingEngineUpdate) {
      this._isAwaitingEngineUpdate = true;
      this._connector.updateEngine(this._playSpeed);
    }

    window.requestAnimationFrame(this.tick);
  }

  get $element() {
    return this._$element;
  }

  setConnector(connector) {
    this._connector = connector;

    this.tick();
  }
}
