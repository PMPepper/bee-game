import React from 'react';

import {BEMComponent} from './BEMComponent.jsx';
import {OList} from './OList.jsx';
import {UList} from './UList.jsx';

export class Tabs extends BEMComponent {
  constructor(props) {
    super(props, 'tabs');

    this.name = props.name || 'tabs'+this.key;
    this._activeTab = +(props.activeTab || 0);
  }

  componentWillMount() {
    this._updateState();
  }

  /*componentDidMount() {
  }

  componentWillUnmount() {
  }*/

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
      return React.cloneElement(item, {
          key: index,
          asHeader: true,
          tabName:this.name,
          blockName: this.element('header-list-item'),
          active: index == this.state.activeTab ? 'true' : 'false',
          onClick:(e) => {this._setActiveTab(index); e.preventDefault(); }
        })
    });

  }

  _setActiveTab(tabIndex) {
    if(this._activeTab == tabIndex) {
      return;
    }
    this._activeTab = tabIndex;

    this._updateState();
  }

  _updateState() {
    this.setState({
      activeTab: this._activeTab
    });
  }

  getContents() {
    if(!this.props.children) {
      return null;
    }

    return this.props.children.map((item, index) => {
      return React.cloneElement(item, {
        key:item.props.name||index,
        tabName:this.name,
        blockName: this.element('contents-list-item'),
        active: index == this.state.activeTab ? 'true' : 'false',
      })
    });
  }

}
