import {RenderHex} from "./RenderHex";

export class RenderHexCanvas extends RenderHex {
  constructor(element, grid) {
    super(grid);

    if(!element || !element.getContext) {
      throw new Error('Argument "element" must be an HTML canvas element');
    }
    this._canvas = element;
    this._context = element.getContext('2d');
  }


  render(x, y) {
    const context = this._context;
    const canvas = this._canvas;
    const width = canvas.width;
    const height = canvas.height;

    context.clearRect(0, 0, width, height);

    //temp code
    context.fillStyle = 'rgb('+Math.floor(Math.random()*255)+', '+Math.floor(Math.random()*255)+', '+Math.floor(Math.random()*255)+')';

    context.fillRect(0, 0, width, height)
  }
}
