import {Coord} from '../../core/Coord';

export class SystemRenderer {
  constructor (system) {
    this._system = system;

    this._zoom = 1/1000000000;
    this.x = 0;
    this.y = 0;
  }

  get system () {
    return this._system;
  }

  set system (newSystem) {
    this._system = newSystem;
  }

  get zoom() {
    return this._zoom;
  }

  set zoom(newZoom) {
    this.zoom = newZoom;
  }

  get x() {
    return this._x;
  }

  set x(newX) {
    this._x = newX;
  }

  get y() {
    return this._y;
  }

  set y(newY) {
    this._y = newY;
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

  render(time) {

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
