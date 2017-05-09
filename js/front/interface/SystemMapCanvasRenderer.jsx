import React from 'react';
import {render} from 'react-dom';
import {ASystemMapRenderer} from './ASystemMapRenderer.jsx';
import {Circle} from '../graphics/Circle';
import {Coord} from '../../core/Coord';


export class SystemMapCanvasRenderer extends ASystemMapRenderer {
  constructor(props) {
    super(props, 'systemMapCanvasRenderer');

    this._isMounted = false;
    this._renderDirty = true;

    this._checkCursorStyle = this._checkCursorStyle.bind(this);

    this.state = {style: {cursor: 'pointer'}};
  }

  render () {
    return <canvas
            onClick={this._onClick}
            onContextMenu={this._onContextMenu}
            onMouseDown={this._onMouseDown}
            onMouseMove={this._checkCursorStyle}
            onWheel={this._onMouseWheel}
            className={this.blockName}
            ref={this.setElement}
            width={this.props.width}
            height={this.props.height}
            style={this.state.style}></canvas>;
  }

  renderSystem() {
    if(!this._renderDirty || !this.props.system) {
      return;
    }

    super.renderSystem();

    const system = this.props.system;
    const element = this._element;
    const ctx = element.getContext('2d');

    ctx.fillStyle = 'rgb(0, 0, 50)';
    ctx.fillRect(0, 0, element.width, element.width);

    system.bodies.forEach((systemBody) => {
      const position = this.systemToScreen(systemBody.position);

      this.renderObject(ctx, systemBody, position);
    }, this);

    this._renderDirty = false;
  }

  renderObject(ctx, systemBody, coord) {
    const minBodyOrbitRenderSize = 5;

    if(systemBody.orbit && (systemBody.orbit.radius*this.zoom < minBodyOrbitRenderSize)) {
      return;
    }

    if(systemBody.orbit) {
      switch(systemBody.orbit.type) {
        case 'OrbitRegular':
          this.renderCircle(ctx, orbitCircle, this.systemToScreen(systemBody.body.parent ? systemBody.body.parent.position : Coord.ORIGIN), systemBody.orbit.radius * this.zoom);
          break;
      }
    }

    const selectedHandler = () => {
      this.selectedSystemBody = systemBody;
    }

    const contextMenuHandler = (e, position) => {
      this.props.onShowSystemBodyContext(position, systemBody);
    }

    switch(systemBody.body.constructor.name) {
      case 'Star':
        this.renderCircle(ctx, starCircle, coord, systemBody.body.radius * this.zoom, systemBody.body.name, selectedHandler, contextMenuHandler);
        break;
      case 'Moon':
        this.renderCircle(ctx, moonCircle, coord, systemBody.body.radius * this.zoom, systemBody.body.name, selectedHandler, contextMenuHandler);
        break;
      case 'Planet':
      default:
        this.renderCircle(ctx, planetCircle, coord, systemBody.body.radius * this.zoom, systemBody.body.name, selectedHandler, contextMenuHandler);
        break;
    }


  }

  renderCircle(ctx, circle, coord, minRadius, label, selectedHandler, contextMenuHandler) {
    const hasFill = getColourAlpha(circle.fillColour) != 0;
    const hasStroke = circle.edgeThickness > 0;
    const radius = Math.max(circle.radius, minRadius);

    ctx.beginPath();
    ctx.arc(coord.x, coord.y, radius, 0, Math.PI*2, false);

    if(hasFill) {
      ctx.fillStyle = colourToCss(circle.fillColour);
      ctx.fill();
    }

    if(hasStroke) {
      ctx.strokeStyle = colourToCss(circle.edgeColour);
      ctx.lineWidth = circle.edgeThickness;
      ctx.stroke();
    }

    if(label) {
      ctx.font = '11px Arial, Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgb(255,255,255)';

      ctx.fillText(label, coord.x, coord.y + radius + 15);
    }

    if(selectedHandler) {
      this.addClickTarget(coord.x, coord.y, radius, selectedHandler, contextMenuHandler);
    }
  }

  _checkCursorStyle(e) {
    const screenPos = this._getElementPosFromPage(e.pageX, e.pageY);
    const currentCursor = this.state.style.cursor;
    let newCursor = 'default';

    for(let i = 0; i < this._clickTargets.length; i++) {
      let clickTarget = this._clickTargets[i];
      let distance2 = Math.pow(screenPos.x - clickTarget.x, 2) + Math.pow(screenPos.y - clickTarget.y, 2);

      if(distance2 < clickTarget.radius) {
        newCursor = clickTarget.cursor;

        break;
      }
    }

    const clickTarget = this.getClickTargetAt(screenPos);

    if(clickTarget) {
      newCursor = clickTarget.cursor;
    }

    if(newCursor != currentCursor) {
      this.state.style = Object.assign({}, this.state.style, {cursor: newCursor});

      this.setState(this.state);
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
const starCircle = new Circle(7, 0xFFFFFFDD);
const planetCircle = new Circle(5, 0xFF3333FF);
const moonCircle = new Circle(4, 0xFF3333FF);

const orbitCircle = new Circle(1, null, 0x66FFFFFF, 0.8);
