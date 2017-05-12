import React from 'react';
import {render} from 'react-dom';
import {Window} from './Window.jsx';
import {BEMComponent} from './BEMComponent.jsx';

export class Windowing extends BEMComponent {
  constructor(props) {
    super(props, 'windowing');

    this._onWindowFocused = this._onWindowFocused.bind(this);
  }

  render () {
    return <div className={this.blockClasses}>
      {this.hasChildren &&
      <ul className={this.element('list')}>
        {this.renderContents()}
      </ul>}
    </div>
  }

  renderContents() {
    if(!this.hasChildren) {
      return null;
    }

    return this.children.map((item, index) => {
        const clonedItem = React.cloneElement(item, {onFocus:this._onWindowFocused});

        return <li className={this.element('item')} key={index}>{clonedItem}</li>
    });
  }

  _onWindowFocused(win) {
    console.log('_onWindowFocused: ', win);
  }
}
