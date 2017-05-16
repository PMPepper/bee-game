import React from 'react';
import {render} from 'react-dom';
import {BEMComponent} from './BEMComponent.jsx';

export class ScrollPane extends BEMComponent {
  constructor(props) {
    super(props, 'scrollPane');

    this._modifiers.vertical = {
      type: 'boolean',
      preset:false
    };

    this._modifiers.horizontal = {
      type: 'boolean',
      preset:false
    };
  }

  render() {
    return <div className={this.blockClasses}>
      {this.props.children}
    </div>
  }
}
