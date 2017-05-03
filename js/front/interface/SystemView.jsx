import React from 'react';
import {render} from 'react-dom';
import {BEMComponent} from './BEMComponent.jsx';
import {SystemMapCanvasRenderer} from '../interface/SystemMapCanvasRenderer.jsx';


import {UList} from '../interface/UList.jsx';
import {OList} from '../interface/OList.jsx';
import {Tabs} from '../interface/Tabs.jsx';
import {TabPanel} from '../interface/TabPanel.jsx';


export class SystemView extends BEMComponent {
  constructor(props) {
    super(props, 'systemView');

    this.componentResized = this.componentResized.bind(this);
  }

  render () {
    return <div className={this.blockClasses}>
      <SystemMapCanvasRenderer system={this.selectedSystem} width={this.state.width} height={this.state.height} />
    </div>;
  }

  get selectedSystem () {
    return this.props.gameState.systems[this.props.selecteSystemIndex || 0];
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
