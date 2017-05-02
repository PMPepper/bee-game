import React from 'react';
import {render} from 'react-dom';
import {ASystemMapRenderer} from './ASystemMapRenderer.jsx';
import {Circle} from '../graphics/Circle';


export class SystemMapCanvasRenderer extends ASystemMapRenderer {
  constructor() {
    super();

    this._canvas = null;
    this._isMounted = false;

    this.componentResized = this.componentResized.bind(this);
    this.tick = this.tick.bind(this);
  }

  render () {
    return <canvas ref={(element) => {this._canvas = element}} width={this.state.width} height={this.state.height}></canvas>;
  }

  componentWillMount() {
    this.componentResized();
  }

  componentDidMount() {
    $(window).on('resize', this.componentResized);

    this._isMounted = true;
    this.tick();

  }

  componentWillUnmount() {
    $(window).off('resize', this.componentResized);

    this._isMounted = false;
  }

  componentResized(e) {
    this.setState({width:document.body.clientWidth, height:document.body.clientHeight});

    this._renderDirty = true;
  }

  get width () {
    return this.state.width;
  }

  get height () {
    return this.state.height;
  }

  setSystemState(systemState) {
    this._systemState = systemState;

    this._renderDirty = true;
  }

  tick() {
    if(!this._isMounted) {
      return;
    }
    this.renderSystem();

    window.requestAnimationFrame(this.tick);
  }

  renderSystem() {
    if(!this._renderDirty || !this._systemState) {
      return;
    }
    const system = this._systemState;
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
