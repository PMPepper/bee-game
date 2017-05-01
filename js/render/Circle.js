export class Circle {
  constructor (radius, fillColour, edgeColour, edgeThickness, edgeStyle) {
    this._radius = radius || 0;
    this._fillColour = fillColour || 0;
    this._edgeColour = edgeColour || 0;
    this._edgeThickness = edgeThickness || 0;
    this._edgeStyle = edgeStyle || null;
  }

  get radius () {
    return this._radius;
  }

  get fillColour () {
    return this._fillColour;
  }

  get edgeColour () {
    return this._edgeColour;
  }

  get edgeThickness () {
    return this._edgeThickness;
  }

  get edgeStyle () {
    return this._edgeStyle;
  }
}
