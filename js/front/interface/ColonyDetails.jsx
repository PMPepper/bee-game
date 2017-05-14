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
  constructor (colony) {
    super();

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
    return <ColonyDetailsRenderer colony={this.colony} />
  }
}


export const ColonyDetails = Object.freeze({
  Renderer: ColonyDetailsRenderer,
  Controller: ColonyDetailsController
});
