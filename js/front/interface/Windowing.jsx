import React from 'react';
import {render} from 'react-dom';
import {Window} from './Window.jsx';
import {BEMComponent} from './BEMComponent.jsx';
import {ReactComponentController} from './ReactComponentController';

class WindowingRenderer extends BEMComponent {
  constructor(props) {
    super(props, 'windowing');

    this._element = null;
  }

  render () {
    return <div className={this.blockClasses} ref={this.props.onSetElement} >
      {this.hasWindows &&
      <ul className={this.element('list')}>
        {this.renderContents()}
      </ul>}
    </div>
  }

  get hasWindows() {
    return this.props && this.props.windows ? this.props.windows.length > 0 : false;
  }

  renderContents() {
    if(!this.hasWindows) {
      return null;
    }

    const windows = this.props.windows;
    const focussedWindow = this.props.focussedWindow;

    return windows.map((win, index) => {
      const isFocussed = win == focussedWindow;

      return <li className={this.element('item')} key={win.id}>
              {win.render(isFocussed, () => {this.focussedWindow = win;})}
            </li>
    });
  }
}

class WindowingController extends ReactComponentController {
  constructor (windows) {
    super();

    this._windows = windows || [];
    this._windowsById = {};

    this._focussedWindow = null;

    this._onWindowClick = this._onWindowClick.bind(this);
    this._onSetElement = this._onSetElement.bind(this);
  }

  get windows() {
    return this._windows;
  }

  get focussedWindow() {
    return this._focussedWindow;
  }

  set focussedWindow(value) {
    if(!this._isKnownWindow(value)) {
      throw new Error('You cannot focus on a window not present in this windowing object');
    }

    if(this.focussedWindow == value) {
      return;//nothing has changed, do nothing
    }

    //bring this window to the top
    const windows = this._windows;

    const index = windows.indexOf(value);
    windows.splice(index, 1);
    windows.push(value);

    this._focussedWindow = value;

    value.visible = true;

    //trigger re-render
    this._doReRender();
  }

  get focussedWindowId() {
    return this.focussedWindow ? this.focussedWindow.id : null ;
  }

  set focussedWindowId(value) {
    const win = this._windowsById[value];

    if(!win) {
      throw new Error('Cannot set focus, window id not known');
    }

    this.focussedWindow = win;
  }

  get hasWindows() {
    return this._windows.length > 0;
  }

  render() {
    return <WindowingRenderer onSetElement={this._onSetElement} windows={this.windows} focussedWindow={this.focussedWindow}></WindowingRenderer>
  }

  addWindow(id, title, content, options = null) {
    options = Object.assign({}, {width:null, height:null, x:null, y:null, draggable:true, resizeable:false}, options);

    const win = new Window.Controller(id, title, content, options.width, options.height, options.x, options.y, options.draggable, options.resizeable);

    this._windowsById[id] = win;
    this._windows.push(win);

    win.addListener('changed', this._doReRender);

    this._doReRender();
  }

  _onWindowClick(e) {
    if(!this._element || $.contains(this._element, e.target)) {
      return;
    }

    this.focussedWindow = null;
  }

  _getWindowById(id) {
    const win = this._windowsById[value];

    return win || null;
  }

  _isKnownWindow(win) {
    if(!win) {
      return false;
    }

    return this._windowsById[win.id] == win;
  }
}

export const Windowing = Object.freeze({
  Renderer: WindowingRenderer,
  Controller: WindowingController
});
