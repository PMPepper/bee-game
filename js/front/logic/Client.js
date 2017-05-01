import {Factory} from './../states/Factory';
import React from 'react';
import {render} from 'react-dom';
import {SystemView} from '../interface/SystemView.jsx';

export class Client {
  constructor($element) {
    this._$element = $element;
    this._connector = null;
    this._state;
  }

  update(newStateObj) {
    this._getStateFromObj(newStateObj);



    render(<SystemView/>, this.$element[0]);
  }

  _getStateFromObj(newStateObj) {
    this._state = Factory.getState(newStateObj);
  }

  get $element() {
    return this._$element;
  }

  setConnector(connector) {
    this._connector = connector;
  }
}
