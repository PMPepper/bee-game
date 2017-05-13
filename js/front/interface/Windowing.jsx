import React from 'react';
import {render} from 'react-dom';
import {WindowDefinition} from './WindowDefinition';
import {Window} from './Window.jsx';
import {BEMComponent} from './BEMComponent.jsx';

export class Windowing extends BEMComponent {
  constructor(props) {
    super(props, 'windowing');

    this._windows = this.props.windows;

    this._focussedWindow = null;

    this.state = {
      windows:this._windows
    };
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

    //trigger rect re-render
    this.setState(this.state);
  }

  get hasWindows() {
    return this._windows.length > 0;
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

  addWindow(win, focus) {
    this._windows.push(win);

    if(focus) {
      this.focussedWindow = win;
    } else {
      //trigger rect re-render
      this.setState(this.state);
    }
  }

  render () {
    return <div className={this.blockClasses}>
      {this.hasWindows &&
      <ul className={this.element('list')}>
        {this.renderContents()}
      </ul>}
    </div>
  }

  renderContents() {
    if(!this.hasWindows) {
      return null;
    }

    const windows = this._windows;
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
