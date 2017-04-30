import {SystemRenderer} from './SystemRenderer';

import {Circle} from '../graphics/Circle';

export class SystemRendererCanvas extends SystemRenderer {
  constructor(system, element) {
    super(system);
    this._element = element;
    this._ctx = element.getContext('2d');
  }


  render(time) {
    const element = this._element;
    const ctx = this._ctx;
    const system = this.system;

    ctx.fillStyle = 'rgb(0, 0, 50)';
    ctx.fillRect(0, 0, element.width, element.width);

    system.bodies.forEach((systemBody) => {
      const position = this.systemToScreen(systemBody.getPosition(time));

      this.renderObject(systemBody.renderStyle, position);
    }, this);
  }

  renderObject(renderable, coord) {
    if(renderable instanceof Circle) {
      return this.renderCircle( renderable, coord);
    }
  }

  renderCircle(circle, coord) {
    const ctx = this._ctx;
    const hasFill = getColourAlpha(circle.fillColour) != 0;
    const hasStroke = circle.edgeThickness > 0;

    ctx.beginPath();
    ctx.arc(coord.x, coord.y, circle.radius, 0, Math.PI*2, false);

    if(hasFill) {
      ctx.fillStyle = colourToCss(circle.fillColour);
      ctx.fill();
    }

    if(hasStroke) {
      ctx.strokeStyle = colourToCss(circle.edgeColour);
      ctx.lineWidth = circle.edgeThickness;
      ctx.stroke();
    }
  }



  //overrides
  get width () {
    return this._element.width;
  }

  get height () {
    return this._element.height;
  }
}

function colourToCss(colour) {
  const a = getColourAlpha(colour);
  const r = (colour & 0x00FF0000) >> 16;
  const g = (colour & 0x0000FF00) >> 8;
  const b = (colour & 0x000000FF);

  return `rgba(${r},${g},${b},${a})`;
}

function getColourAlpha(colour) {
  return ((colour >> 24) & 0xFF)/0xFF;
}
