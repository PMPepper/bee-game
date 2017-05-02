import React from 'react';

import {BEMComponent} from './BEMComponent.jsx';
import {OList} from './OList.jsx';
import {UList} from './UList.jsx';

export class Tabs extends BEMComponent {
  constructor(props) {
    super(props, 'tabs');

    this.name = props.name || 'tabs'+this.key;
  }

  render() {
    return <div className={this.blockName}>
      <div className={this.element('header')}>
        <ol className={this.element('header-list', false)}>
          {this.getHeader()}
        </ol>
      </div>
      <div className={this.element('contents')}>
        <ol className={this.element('contents-list')}>
          {this.getContents()}
        </ol>
      </div>
    </div>;
  }

  getHeader() {
    if(!this.props.children) {
      return null;
    }

    return this.props.children.map((item, index) => {
      return <li className={this.element('header-list-item')}>
        {React.cloneElement(item, {asHeader: true, key:item.props.name||index, tabName:this.name, blockName: this.element('contents-list-item')})}
      </li>
    });

  }

  getContents() {
    if(!this.props.children) {
      return null;
    }

    return this.props.children.map((item, index) => {
      return React.cloneElement(item, {key:item.props.name||index, tabName:this.name, blockName: this.element('contents-list-item')})
    });
  }

}
