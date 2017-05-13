import React from 'react';
import {render} from 'react-dom';
import {BEMComponent} from './BEMComponent.jsx';
import {Coord} from '../../core/Coord';

export class Window extends BEMComponent {
  constructor(props) {
    super(props, 'window');

    this.state = {style: {}}

    this._onHeaderMouseDown = this._onHeaderMouseDown.bind(this);
    this._onHeaderMouseMove = this._onHeaderMouseMove.bind(this);
    this._onHeaderMouseUp = this._onHeaderMouseUp.bind(this);

    this._dragLastCoord = null;

    this._modifiers = {
      isFocussed: {
        type: 'boolean',
        preset: false
      },
      draggable: {
        type: 'boolean'
      },
      resizeable: {
        type: 'boolean'
      }
    };
  }

  componentWillMount() {
    const newStyle = {};

    if(this.props.width) {
      newStyle.width = (+this.props.width)+'px';
    }

    if(this.props.height) {
      newStyle.height = (+this.props.height)+'px';
    }

    this._x = +this.props.x;
    this._y = +this.props.y;

    newStyle.left = this._x + 'px';
    newStyle.top = this._y + 'px';

    this._alterStyle(newStyle);
  }

  render () {
    return <section className={this.blockClasses} style={this.state.style} onMouseDown={() =>{this.props.onFocus(this)}}>
      <header className={this.element('header')} onMouseDown={this.props.draggable ? this._onHeaderMouseDown : null}>{this.props.title}</header>
      <div className={this.element('body')}>
        {this.props.children}
      </div>
    </section>
  }

  _onHeaderMouseDown(e) {
    e.preventDefault();

    $(window)
      .on('mousemove', this._onHeaderMouseMove)
      .on('mouseup', this._onHeaderMouseUp);

    this._dragLastCoord = new Coord(e.pageX, e.pageY);
  }

  _onHeaderMouseMove(e) {
    const dragCurCoord = new Coord(e.pageX, e.pageY);
    const dragDeltaCoord = dragCurCoord.subtract(this._dragLastCoord);

    this._x += dragDeltaCoord.x;
    this._y += dragDeltaCoord.y;

    this._dragLastCoord = dragCurCoord;

    this._alterStyle({left:this._x+'px', top:this._y+'px'})
  }

  _onHeaderMouseUp(e) {
    $(window)
      .off('mousemove', this._onHeaderMouseMove)
      .off('mouseup', this._onHeaderMouseUp);
  }

  _alterStyle(changeStyles) {
    const newStyle = Object.assign({}, this.state.style, changeStyles);

    this.state.style = newStyle;

    this.setState(this.state);
  }
}

Window.defaultProps = {
  draggable: true,
  resizeable: false,
  x:200,
  y:200
};
