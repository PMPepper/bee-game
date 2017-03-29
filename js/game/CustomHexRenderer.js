const hexAngleCos = Math.cos(Math.PI / 180 * 30);
const hexAngleSin = Math.sin(Math.PI / 180 * 30);

export class CustomHexRenderer {
  constructor(hex, lineStyle, fillStyle, textStyle) {
    this._hex = hex;
    this._lineStyle = lineStyle;
    this._fillStyle = fillStyle;
    this._textStyle = textStyle;

    Object.preventExtensions(this);
  }

  render(renderX, renderY, size, ctx) {
    const width = hexAngleCos * size * 2;
    const hex = this.hex;
    const lineStyle = this.lineStyle;
    const fillStyle = this.fillStyle;
    const textStyle = this.textStyle;

    const x = renderX + (hex.col * width) + (hex.row * width * 0.5);
    const y = renderY + (hex.row * size * 1.5);

    const initialLineStyle = ctx.lineStyle;
    const initialFillStyle = ctx.fillStyle;
    const initialFont = ctx.font;

    //set styles
    ctx.lineStyle = lineStyle;
    ctx.fillStyle = fillStyle;
    ctx.font = Math.round(size * 0.6) +'px Arial';

    //draw the hex
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

    //draw label
    ctx.fillStyle = textStyle;

    ctx.fillText(hex.hash, x, y + Math.round(size * 0.2));

    //reset styles
    ctx.lineStyle = initialLineStyle;
    ctx.fillStyle = initialFillStyle;
    ctx.font = initialFont;
  }

  get hex() { return this._hex; }

  get lineStyle() { return this._lineStyle; }
  get fillStyle() { return this._fillStyle; }
  get textStyle() { return this._textStyle; }

  set lineStyle(val) { this._lineStyle = val+''; }
  set fillStyle(val) { this._fillStyle = val+''; }
  set textStyle(val) { this._textStyle = val+''; }

}
