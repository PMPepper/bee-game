import React from 'react';
import {render} from 'react-dom';

export class Window extends React.Component {
  constructor(props) {
    super(props);

    this._key = id++;
  }

  get key() {
    return this._key;
  }

  render () {
    return <div className="window">
      This is a window: {this.props.title}.
      {this.props.children}
    </div>
  }
}

let id = 0;
