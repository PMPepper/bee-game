import React from 'react';
import {render} from 'react-dom';
import {WindowDefinition} from './WindowDefinition';
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
    const focussedWindow = this.focussedWindow;

    return windows.map((win, index) => {
      const isFocussed = win == focussedWindow;

      return <li className={this.element('item')} key={win.id}>
              <Window
                isFocussed={isFocussed}
                title={win.title}
                width={win.width}
                height={win.height}
                x={win.x}
                y={win.y}
                draggable={win.draggable}
                resizeable={win.resizeable}
                onFocus={() => {this.focussedWindow = win;}}>
                {win.render()}
              </Window>
            </li>
    });
  }
}

class WindowingController extends ReactComponentController {
  constructor (windows) {
    super();

    this._windows = windows || [];

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

    //trigger re-render
    this._doReRender();
  }

  get hasWindows() {
    return this._windows.length > 0;
  }

  render() {
    return <WindowingRenderer onSetElement={this._onSetElement} windows={this.windows}></WindowingRenderer>
  }

  addWindow(win, focus) {
    this._windows.push(win);

    if(focus) {
      this.focussedWindow = win;
    } else {
      //trigger rect re-render
      this._doReRender();
    }
  }

  _onWindowClick(e) {
    if(!this._element || $.contains(this._element, e.target)) {
      return;
    }

    this.focussedWindow = null;
  }

  _getWindowById(id) {
    const windows = this._windows;

    for(let i = 0; i < windows.length; i++) {
      if(windows[i].id == id) {
        return windows[i];
      }
    }

    return null;
  }

  _isKnownWindow(win) {
    const windows = this._windows;

    for(let i = 0; i < windows.length; i++) {
      if(windows[i] == win) {
        return true;
      }
    }

    return false;
  }
}

export const Windowing = Object.freeze({
  Renderer: WindowingRenderer,
  Controller: WindowingController
});
