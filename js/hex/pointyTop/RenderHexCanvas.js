import {RenderHex} from "./RenderHex";

export class RenderHexCanvas extends RenderHex {
  constructor(element, grid) {
    super(grid);

    if(!element || !element.getContext) {
      throw new Error('Argument "element" must be an HTML canvas element');
    }
    this._canvas = element;
    this._context = element.getContext('2d');
    this._customRendererModuleName = 'render-content-2d';

    this._hexSize = 16;
  }

  get hexSize() {
    return this._hexSize;
  }

  set hexSize(newHexSize) {
    newHexSize = +newHexSize;

    if(isNaN(parseFloat(newHexSize)) || !isFinite(newHexSize) || newHexSize <= 0 ) {
      throw new Error(`Invalid value for hexSize, must be a number greater than 0, value was "${newHexSize}"`);
    }

    this._hexSize = newHexSize;
  }


  render(x, y, scale = 1) {
    const ctx = this._context;
    const canvas = this._canvas;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const arr = [];

    //TODO this needs to be only the hexes that are visible...
    this._grid.forEach((hex) => {
      arr.push(hex);
    });

    this.renderHexes(x, y, scale, arr);
  }

  renderHexes(x, y, scale, hexes) {
    const ctx = this._context;
    const hexSize = this.hexSize * scale;

    ctx.font = Math.round(hexSize * 0.6) +'px Arial';
    ctx.textAlign = 'center';

    let width = hexAngleCos * hexSize * 2;

    for(let i = 0; i < hexes.length; i++ ) {
      let hex = hexes[i];

      if(hex.modules[this.customRendererModuleName]) {
        hex.modules[this.customRendererModuleName].render(x, y, hexSize, ctx);
      } else {
        this.renderHexAt(x + (hex.col * width) + (hex.row * width * 0.5), y + (hex.row * hexSize * 1.5), hexSize, hex.hash, '#000000', '#CCCCCC', '#000000');
      }
    }
  }

  renderHexAt(x, y, size, label, lineStyle, fillStyle, textStyle) {
    const ctx = this._context;

    const initialLineStyle = lineStyle;
    const initialFillStyle = fillStyle;

    ctx.lineStyle = lineStyle;
    ctx.fillStyle = fillStyle;

    ctx.beginPath();
    ctx.moveTo(x                       , y - size);
    ctx.lineTo(x + (hexAngleCos * size), y - (hexAngleSin * size));
    ctx.lineTo(x + (hexAngleCos * size), y + (hexAngleSin * size));
    ctx.lineTo(x                       , y + size);
    ctx.lineTo(x - (hexAngleCos * size), y + (hexAngleSin * size));
    ctx.lineTo(x - (hexAngleCos * size), y - (hexAngleSin * size));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if(label) {
      ctx.fillStyle = textStyle;

      ctx.fillText(label, x, y + Math.round(size * 0.2));
    }

    ctx.lineStyle = initialLineStyle;
    ctx.fillStyle = initialFillStyle;
  }
}

var angleRad = Math.PI / 180 * 30;
const hexAngleCos = Math.cos(angleRad);
const hexAngleSin = Math.sin(angleRad);
