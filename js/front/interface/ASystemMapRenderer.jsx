import React from 'react';
import {render} from 'react-dom';
import {Coord} from '../../core/Coord';
import {BEMComponent} from './BEMComponent.jsx';


export class ASystemMapRenderer extends BEMComponent {
  constructor(props, block) {
    super(props, block);

    this._zoom = +this.props.zoom || 1/1000000000;
    this._x = +this.props.x ||0;
    this._y = +this.props.y ||0;
    this._cx = +this.props.cx ||0.5;
    this._cy = +this.props.cy ||0.5;

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
    return this._cx;
  }

  get cy () {
    return this._cy;
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
