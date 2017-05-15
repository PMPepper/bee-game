import React from 'react';
import {render} from 'react-dom';
import {BEMComponent} from './BEMComponent.jsx';
import {Coord} from '../../core/Coord';
import {ReactComponentController} from './ReactComponentController';

export class WindowRenderer extends BEMComponent {
  constructor(props) {
    super(props, 'window');

    this.state = {style: {}}

    this._onHeaderMouseDown = this._onHeaderMouseDown.bind(this);
    this._onHeaderMouseMove = this._onHeaderMouseMove.bind(this);
    this._onHeaderMouseUp = this._onHeaderMouseUp.bind(this);
    this._centerWindow = this._centerWindow.bind(this);

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

    this._x = this.props.x === null ? null : +this.props.x;
    this._y = this.props.y === null ? null : +this.props.y;

    if(this._x !== null) {
      newStyle.left = this._x + 'px';
    }

    if(this._y !== null) {
      newStyle.top = this._y + 'px';
    }

    this._alterStyle(newStyle);
  }

  render () {
    if(!this.props.visible){
      return null;
    }



    return <section ref={this._x === null || this._y === null ? this._centerWindow : null } className={this.blockClasses} style={this.state.style} onMouseDown={() =>{this.props.onFocus(this)}}>
      <header className={this.element('header')} onMouseDown={this.props.draggable ? this._onHeaderMouseDown : null}>{this.props.title}</header>
      <div className={this.element('body')}>
        {this.props.content.render()}
      </div>
    </section>
  }

  _centerWindow(element) {
    if(this._x === null || this._y === null) {
      let alteredStyle = {};

      if(this._x === null) {
        this._x = Math.round((window.innerWidth - element.clientWidth)/2);
        alteredStyle.left = this._x + 'px';
      }

      if(this._y === null) {
        this._y = alteredStyle.top = Math.round((window.innerHeight - element.clientHeight)/2);
        alteredStyle.top = this._y + 'px';
      }

      this._alterStyle(alteredStyle);
    }
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

WindowRenderer.defaultProps = {
  draggable: true,
  resizeable: false
};

export class WindowController extends ReactComponentController {
  constructor(id, title, content, width = null, height = null, x = null, y = null, draggable = true, resizeable = false) {
    super();

    this._id = id;
    this._title = title;
    this._content = content;
    this._width = width;
    this._height = height;
    this._x = x;
    this._y = y;
    this._draggable = draggable;
    this._resizeable = resizeable;

    this._visible = false;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get draggable() {
    return this._draggable;
  }

  get resizeable() {
    return this._resizeable;
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    value = !!value;

    if(value != this._visible) {
      this._visible = value;

      this._doReRender();
    }
  }

  render(isFocussed, onFocus) {
    return <WindowRenderer
      isFocussed={isFocussed}
      title={this.title}
      width={this.width}
      height={this.height}
      x={this.x}
      y={this.y}
      draggable={this.draggable}
      resizeable={this.resizeable}
      onFocus={onFocus}
      visible={this.visible}
      content={this._content}>
    </WindowRenderer>
  }
}


export const Window = Object.freeze({
  Controller: WindowController,
  Renderer: WindowRenderer
});
