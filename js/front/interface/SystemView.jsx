import React from 'react';
import {render} from 'react-dom';


export class SystemView extends React.Component {
  constructor() {
    super();

    this._canvas;

    this.componentResized = this.componentResized.bind(this);
  }

  render () {
    return <canvas ref={(element) => {this._canvas = element}} width={this.state.width} height={this.state.height}></canvas>;
  }

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
    this.setState({width:document.body.clientWidth, height:document.body.clientHeight});
  }
}
