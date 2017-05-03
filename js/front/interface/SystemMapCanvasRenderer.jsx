import React from 'react';
import {render} from 'react-dom';
import {ASystemMapRenderer} from './ASystemMapRenderer.jsx';
import {Circle} from '../graphics/Circle';


export class SystemMapCanvasRenderer extends ASystemMapRenderer {
  constructor(props) {
    super(props, 'systemMapCanvasRenderer');

    this._canvas = null;
    this._isMounted = false;
    this._renderDirty = true;

    this.tick = this.tick.bind(this);
    this.setCanvasElement = this.setCanvasElement.bind(this);
  }

  render () {
    return <canvas className={this.blockName} ref={this.setCanvasElement} width={this.props.width} height={this.props.height}></canvas>;
  }

  setCanvasElement(element) {
    this._canvas = element;
    this._renderDirty = true;
  }

  componentDidMount() {
    this._isMounted = true;
    this.tick();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate (prevProps, prevState) {
    this._renderDirty = true;
  }

  get width () {
    return this.props.width;
  }

  get height () {
    return this.props.height;
  }

  tick() {
    if(!this._isMounted) {
      return;
    }
    this.renderSystem();

    window.requestAnimationFrame(this.tick);
  }

  renderSystem() {
    if(!this._renderDirty || !this.props.system) {
      return;
    }
    const system = this.props.system;
    const element = this._canvas;
    const ctx = element.getContext('2d');

    ctx.fillStyle = 'rgb(0, 0, 50)';
    ctx.fillRect(0, 0, element.width, element.width);

    system.bodies.forEach((systemBody) => {//debugger;
      const position = this.systemToScreen(systemBody.position);

      this.renderObject(ctx, systemBody, position);
    }, this);

    this._renderDirty = false;
  }

  renderObject(ctx, systemBody, coord) {
    switch(systemBody.type) {
      case 'star':
        return this.renderCircle(ctx, starCircle, coord);
      case 'planet':
      default:
        return this.renderCircle(ctx, planetCircle, coord);

    }
  }

  renderCircle(ctx, circle, coord) {
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


//styles
const starCircle = new Circle(5, 0xFFFFFFDD);
const planetCircle = new Circle(4, 0xFF3333FF);
