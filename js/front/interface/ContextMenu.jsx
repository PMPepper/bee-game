import React from 'react';
import {BEMComponent} from './BEMComponent.jsx';

export class ContextMenu extends BEMComponent {
  constructor(props) {
    super(props, 'contextMenu');
  }

  componentWillMount() {
    //TODO adjust this based on window to prevent going offscreen
    this.setState({style: {left: this.props.x, top: this.props.y}});
  }

  render() {
    return <div style={this.state.style} className={this.blockClasses}>{this.props.children}</div>
  }
}
