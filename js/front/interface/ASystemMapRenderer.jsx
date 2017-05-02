import React from 'react';
import {render} from 'react-dom';
import {Coord} from '../../core/Coord';


export class ASystemMapRenderer extends React.Component {
  constructor() {
    super();

    this._zoom = 1/1000000000;
    this.x = 0;
    this.y = 0;

    this._renderDirty = true;

    if(new.target == ASystemMapRenderer) {
      throw new Error('Class ASystemMapRenderer cannot be instanciated directly');
    }
  }

  get zoom() {
    return this._zoom;
  }

  set zoom(newZoom) {
    this.zoom = newZoom;
    this._renderDirty = true;
  }

  get x() {
    return this._x;
  }

  set x(newX) {
    this._x = newX;
    this._renderDirty = true;
  }


  get y() {
    return this._y;
  }

  set y(newY) {
    this._y = newY;
      this._renderDirty = true;
  }

  get width () {
    return 100;
  }

  get height () {
    return 100;
  }

  get cx () {
    return 0.5;
  }

  get cy () {
    return 0.5;
  }

  systemToScreen(coords) {
    const zoom = this.zoom;

    let x;
    let y;

    x = (coords.x * zoom) + (this.width*this.cx);
    y = (coords.y * zoom) + (this.height*this.cy);

    return new Coord(x, y);
  }

  screenToSystem(coords) {
    let x;
    let y;

    return new Coord(x, y);
  }
}
