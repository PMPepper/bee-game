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
    this._gameSpeedClicked = this._gameSpeedClicked.bind(this);
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
            <div className={this.element('gameSpeeds')} onClick={this._gameSpeedClicked}>
              <button className={this.element('gameSpeedButton', {speed:'0'})}>Pause</button>
              <button className={this.element('gameSpeedButton', {speed:'1'})}>Play</button>
              <button className={this.element('gameSpeedButton', {speed:'2'})}>Fast</button>
            </div>
          </div>
        </div>
        <br />
        <div className={this.element('panel')}>
          <Select values={this.visibleSystemNames} onChange={(e) => {console.log('select changed: ', arguments);}} label={null} />
        </div>
      </div>
      <SystemMapCanvasRenderer system={this.selectedSystem} width={this.state.width} height={this.state.height} />
    </div>;
  }

  _topMenuClicked(e) {
    e.target;
  }

  _gameSpeedClicked(e) {
    e.target;
  }

  get selectedSystem () {
    return this.props.gameState.systems[this.props.selecteSystemIndex || 0];
  }

  get visibleSystems() {
    return this.props.gameState.systems;
  }

  get visibleSystemNames () {
    return this.visibleSystems.map((system) => {return system.name});
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
