export class WindowDefinition {
  constructor(id, title, width = null, height = null, x = null, y = null, draggable = true, resizeable = false) {
    this._id = id;
    this._title = title;
    this._width = width;
    this._height = height;
    this._x = x;
    this._y = y;
    this._draggable = draggable;
    this._resizeable = resizeable;
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

  render() {
    throw new Error('Not implemented');
  }
}
