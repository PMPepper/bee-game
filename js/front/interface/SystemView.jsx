import React from 'react';
import {render} from 'react-dom';
import {BEMComponent} from './BEMComponent.jsx';
import {SystemMapCanvasRenderer} from '../interface/SystemMapCanvasRenderer.jsx';


import {UList} from '../interface/UList.jsx';
import {OList} from '../interface/OList.jsx';
import {Tabs} from '../interface/Tabs.jsx';
import {TabPanel} from '../interface/TabPanel.jsx';

import {Date} from '../interface/Date.jsx';
import {Select} from '../interface/Select.jsx';


export class SystemView extends BEMComponent {
  constructor(props) {
    super(props, 'systemView');

    this.componentResized = this.componentResized.bind(this);
    this._topMenuClicked = this._topMenuClicked.bind(this);
    this._gameStepClicked = this._gameStepClicked.bind(this);
  }

  render () {
    return <div className={this.blockClasses}>
      <div className={this.element('holder')}>
        <div className={this.element('topMenu')}>
          <div className={this.element('buttons')} onClick={this._topMenuClicked}>
            <button className={this.element('button', {type:'colonies'})}>Colonies</button>
            <button className={this.element('button', {type:'research'})}>Research</button>
          </div>
          <div className={this.element('gameSpeed')}>
            <Date date={this.props.gameState.time}/>
            <div>
              <label>Constant play: <input type="checkbox" value="constant" checked={this.props.constantPlayOn? 'checked' : false} onChange={(e)=>{this.props.onConstantPlayToggle();}} /></label>
            </div>
            <div className={this.element('gameSpeeds')} onClick={this._gameStepClicked}>
              <button className={this.element('gameSpeedButton', {step:'5'})}>5 sec</button>
              <button className={this.element('gameSpeedButton', {step:'3600'})}>1 hour</button>
              <button className={this.element('gameSpeedButton', {step:'86400'})}>1 day</button>
              <button className={this.element('gameSpeedButton', {step:'2592000'})}>30 days</button>
            </div>
          </div>
        </div>
        <br />
        <div className={this.element('panel')}>
          <Select values={this.knownSystemNames} onChange={(e) => {console.log('select changed: ', arguments);}} label={null} />
        </div>
      </div>
      <SystemMapCanvasRenderer system={this.selectedSystem} width={this.state.width} height={this.state.height} />
    </div>;
  }

  _topMenuClicked(e) {
    e.target;
  }

  _gameStepClicked(e) {
    const stepSize = +BEMComponent.getModifierFromElement(e.target, 'step');

    this.props.onGameStepSelected(stepSize);
  }

  get selectedSystem () {
    return this.props.gameState.systems[this.props.selecteSystemIndex || 0];
  }

  get knownSystems() {
    return this.props.gameState.knownSystems;
  }

  get knownSystemNames () {
    return this.knownSystems.map((knownSystem) => {return knownSystem.name});
  }

  //deal with resizing
  componentWillMount() {
    this.componentResized();
  }

  componentDidMount() {
    $(window).on('resize', this.componentResized);
  }

  componentWillUnmount() {
    $(window).off('resize', this.componentResized);
  }

  componentResized(e) {
    this.setState({
      width:document.body.clientWidth,
      height:document.body.clientHeight
    })
  }
}
