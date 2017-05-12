import React from 'react';
import {render} from 'react-dom';
import {BEMComponent} from './BEMComponent.jsx';

export class Window extends BEMComponent {
  constructor(props) {
    super(props, 'window');

    this._key = id++;

    this.state = {style: {}}
  }

  get key() {
    return this._key;
  }

  componentWillMount() {
    const newStyle = {};

    if(this.props.width) {
      newStyle.width = this.props.width;
    }

    if(this.props.height) {
      newStyle.height = this.props.height;
    }

    if(this.props.x) {
      newStyle.left = this.props.x;
    }

    if(this.props.y) {
      newStyle.top = this.props.y;
    }

    this._alterStyle(newStyle);
  }

  render () {
    return <section className={this.blockClasses} style={this.state.style}>
      <header className={this.element('header')}>This is a window: {this.props.title}.</header>
      <div className={this.element('body')}>
        {this.props.children}
      </div>
    </section>
  }

  _alterStyle(changeStyles) {
    const newStyle = Object.assign({}, this.state.style, changeStyles);

    this.state.style = newStyle;

    this.setState(this.state);
  }
}

let id = 0;
