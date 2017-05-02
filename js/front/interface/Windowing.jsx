import React from 'react';
import {render} from 'react-dom';
import {Window} from './Window.jsx';
import {Helpers} from './Helpers.jsx';

export class Windowing extends React.Component {
  constructor() {
    super();

    this._windows = {};
    this._isMounted = false;
  }

  componentWillMount() {
    this._isMounted = true;

    this._updateState();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render () {
    console.log('render');

    console.log( Helpers.mapObject(this.state.windows, (key, value) => {
      return <li key={key} className="windowing-windows-item"><Window title={value} /></li>;
    }) );


    return <div className="windowing">
      <ul className="windowing-windows">
        {Helpers.mapObject(this.state.windows, (key, value) => {
          return <li key={key} className="windowing-windows-item">
            <Window {...value.props}>

            </Window>
          </li>;
        })}
      </ul>
    </div>
  }

  addWindow(win) {
    if(!win) {
      return;
    }

    if(!this._windows[win.id]) {
      this._windows[win.id] = win;

      this._updateState();
    }
  }

  _updateState() {
    if(!this._isMounted) {
      return;
    }

    this.setState({
      windows: this._windows
    });
  }
}
