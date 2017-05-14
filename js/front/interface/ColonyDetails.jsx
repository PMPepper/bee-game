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

    this._colony = colony;
  }

  get colony() {
    return this._colony;
  }

  set colony(value) {
    this._colony = value;
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
