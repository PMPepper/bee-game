import {Factory} from './../states/Factory';
import React from 'react';
import {render} from 'react-dom';

import {SystemView} from '../interface/SystemView.jsx';

const minTimeSinceLastUpdate = 0.1;

export class Client {
  constructor($element) {
    this._$element = $element;
    this._connector = null;
    this._state;

    this._constantPlay = false;
    this._isPlaying = false;
    this._lastUpdateTime = 0;

    this._engineUpdatePeriod = 86400;//time in seconds

    this._isAwaitingEngineUpdate = false;

    this._isDestroyed = false;

    this.tick = this.tick.bind(this);

  }

  update(newStateObj) {
    this._isAwaitingEngineUpdate = false;
    this._getStateFromObj(newStateObj);

    this._lastUpdateTime = Date.now() / 1000;

    this.doRender();
  }

  doRender() {
    this._systemView = render(<SystemView
      selecteSystemIndex="0"
      gameState={this._state}
      constantPlayOn={this._constantPlay}
      onConstantPlayToggle={() => {
        this._constantPlay = !this._constantPlay;
        this._isPlaying = false;

        this.doRender();
      }}
      onGameStepSelected={(stepSize)=>{
        this._engineUpdatePeriod = stepSize;
        this._isPlaying = true;
      }}
    />, this.$element[0]);
  }

  _getStateFromObj(newStateObj) {
    this._state = Factory.getState(newStateObj);
  }

  tick () {
    if(this._isDestroyed ) {
      return;
    }

    window.requestAnimationFrame(this.tick);

    if(this._isAwaitingEngineUpdate || !this._isPlaying) {
      return ;
    }

    if(!this._constantPlay) {
      this._doEngineUpdate();
    } else if((Date.now()/1000) > (this._lastUpdateTime + minTimeSinceLastUpdate)) {
      this._doEngineUpdate();
    }
  }

  _doEngineUpdate() {
    if(this._isAwaitingEngineUpdate) {
      return;
    }
    this._isAwaitingEngineUpdate = true;
    this._isPlaying = this._constantPlay;
    this._connector.updateEngine(this._engineUpdatePeriod);
  }

  get $element() {
    return this._$element;
  }

  setConnector(connector) {
    this._connector = connector;

    this.tick();
  }
}
