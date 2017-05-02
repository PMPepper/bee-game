import React from 'react';
import {BEMComponent} from './BEMComponent.jsx';

export class TabPanel extends BEMComponent {
  constructor(props) {
    super(props, 'tabPanel');

    this.title = props.title;
    this.name = this.props.name || 'tabPanel' + this.key;

    this._modifiers = {
      'active': {type:'boolean', preset:false}
    };
  }

  get id () {
    return this.props.tabName + '-' + this.name;
  }

  /*componentDidMount() {
  }*/

  render() {
    if(this.props.asHeader) {
      return this.renderHeader();
    } else {
      return this.renderBody();
    }
  }

  renderHeader () {
    return <li className={this.blockClasses}><a className={this.element( 'link' )} href={'#'+this.id} onClick={this.props.onClick}>{this.title}</a></li>
  }

  renderBody() {
    return <li id={this.id} className={this.blockClasses}>
      {this.props.children}
    </li>;
  }

}
