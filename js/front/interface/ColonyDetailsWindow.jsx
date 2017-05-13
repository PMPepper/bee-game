import React from 'react';
import {render} from 'react-dom';
import {WindowDefinition} from './WindowDefinition'

export class ColonyDetailsWindow extends WindowDefinition {
  constructor() {
    //id, title, render, width, height, x, y, draggable, resizeable
    super('colonyDetails', 'Colony Details', 600, 400, 300, 300, true, false);
  }

  render() {
    return <div>TODO colony details</div>
  }
}
