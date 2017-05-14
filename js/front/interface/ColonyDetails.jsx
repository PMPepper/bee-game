import React from 'react';
import {render} from 'react-dom';
import {BEMComponent} from './BEMComponent.jsx'
import {ReactComponentController} from './ReactComponentController';

class ColonyDetailsRenderer extends BEMComponent {
  constructor(props) {
    super(props, 'colonyDetails');

    //this.render = this.render.bind(this);
  }

  render() {
    if(!this.props.colony) {
      return <article className={this.blockClasses}>No colony selected</article>
    }
    return <article className={this.blockClasses}>Colony population: {this.props.colony.population}</article>
  }
}

class ColonyDetailsController extends ReactComponentController {
  constructor (client, colony) {
    super();

    this._gameStateUpdatedListener = client.addListener('gameStateUpdated', (event) => {
      this._gameState = event.updatedGameState;
    });

    //naughty..
    this._gameState = client._state;
    this._colonyId = colony ? colony.id : null;
  }

  get colony() {
    if(!this._gameState || !this._colonyId) {
      return null;
    }

    return this._gameState.getStateById(this._colonyId);
  }

  set colony(value) {
    this._colonyId = value ? value.id : null;
    this._doReRender();
  }

  render() {
    return <ColonyDetailsRenderer colony={this.colony} gameState={this._gameState} />
  }
}


export const ColonyDetails = Object.freeze({
  Renderer: ColonyDetailsRenderer,
  Controller: ColonyDetailsController
});
