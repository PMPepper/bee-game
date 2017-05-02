import React from 'react';
import {BEMComponent} from './BEMComponent.jsx';

export class TabPanel extends BEMComponent {
  constructor(props) {
    super(props, 'tabPanel');

    this.title = props.title;
    this.name = this.props.name || 'tabPanel' + this.key;
  }

  get id () {
    return this.props.tabName + '-' + this.name;
  }

  render() {
    if(this.props.asHeader) {
      return this.renderHeader();
    } else {
      return this.renderBody();
    }
  }

  renderHeader () {
    return <a href={'#'+this.id}>{this.title}</a>
  }

  renderBody() {
    return <li id={this.id} className={this.blockClasses}>
      {this.props.children}
    </li>;
  }

}
