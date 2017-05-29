import React from 'react';
import {render} from 'react-dom';
import {ASystemMapRenderer} from './ASystemMapRenderer.jsx';
import {Circle} from '../graphics/Circle';
import {Coord} from '../../core/Coord';
import * as Helpers from '../Helpers';

const bgImg = new window.Image();
bgImg.src = '../images/bg.png';
bgImg.onload = (e) => {
  //record that this is loaded
}


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

    var ptrn = ctx.createPattern(bgImg, 'repeat'); // Create a pattern with this image, and set it to "repeat".
    ctx.fillStyle = ptrn;
    ctx.fillRect(0, 0, element.width, element.height);

    system.knownSystemBodies.forEach((knownSystemBody) => {
      const position = this.systemToScreen(knownSystemBody.systemBody.position);

      this.renderObject(ctx, knownSystemBody, position);
    }, this);

    this.renderScale();

    this._renderDirty = false;
  }

  renderScale() {
    const validFractions = [1.5, 2, 2.5, 3, 4, 5, 6, 7, 7.5, 8, 9];

    //calculate most appropriate scale
    const possibleFormats = [];

    const maxWidth = 200;
    const maxDistance = maxWidth / this.zoom;//in meters

    //Calculate SI units
    const maxDistMag = Math.floor(Math.log10(maxDistance));
    const maxDistPow = Math.pow(10, maxDistMag);

    const nearestPowLength = maxWidth * (maxDistPow / maxDistance);
    //Nearest pow of 10
    possibleFormats.push({length: nearestPowLength, distance: maxDistPow})

    validFractions.forEach((val) => {
      if(nearestPowLength * val <= maxWidth) {
        possibleFormats.push({length: nearestPowLength * val, distance: maxDistPow * val})
      }
    });

    //pick format with longest distance
    possibleFormats.sort((fA, fB) => {return fB.length - fA.length;})
    const formatSI = possibleFormats[0];

    //TODO calculate light years/days seconds/etc
    const ls = Helpers.metersToLightSeconds(maxDistance);
    const lm = Helpers.metersToLightMinutes(maxDistance);
    const lh = Helpers.metersToLightHours(maxDistance);
    const ld = Helpers.metersToLightDays(maxDistance);
    const ly = Helpers.metersToLightYears(maxDistance);

    let lengthC = 0;
    let distanceC = 0;
    let cDist = 0;
    let unitC = null;
    let lengthPerUnit = 0;

    if(ly > 0.1) {
      //light years
      cDist = ly;
      unitC = 'LY';
    } else if (ld > 1) {
      //light days
      cDist = ld;
      unitC = 'LD';
    } else if (lh > 1) {
      //light hours
      cDist = lh;
      unitC = 'LH';
    } else if (lm > 1) {
      //light minutes
      cDist = lm;
      unitC = 'LM';
    } else {
      //light seconds
      cDist = ls;
      unitC = 'LS';
    }

    distanceC = Helpers.floorTo(cDist, cDist < 2 ? 1 : 0);
    lengthC = maxWidth * (distanceC / cDist);

    this._doRenderScale(formatSI.length, formatSI.distance, lengthC, distanceC, unitC);

  }

  _doRenderScale(lengthSI, distanceSI, lengthC, distanceC, unitC) {
    //first, position
    const offX = 4.5;
    const offY = 100.5;
    const endMarkHeight = 5;
    const element = this._element;
    const ctx = element.getContext('2d');

    ctx.save();

    ctx.strokeStyle = '#FFF'
    ctx.lineWidth = 1;

    //SI line
    ctx.beginPath();
    ctx.moveTo(offX, offY);
    ctx.lineTo(offX + lengthSI, offY);
    ctx.lineTo(offX + lengthSI, offY - endMarkHeight);
    ctx.stroke();

    //SI Label
    ctx.font = '11px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgb(255,255,255)';

    ctx.shadowColor = '#000';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 3;

    ctx.fillText(Helpers.formatDistanceSI(distanceSI, 1), offX+0.5, offY - 4.5);

    if(lengthC > 0) {
      //C line
      ctx.beginPath();
      ctx.moveTo(offX, offY);
      ctx.lineTo(offX + lengthC, offY);
      ctx.lineTo(offX + lengthC, offY + endMarkHeight + 1);
      ctx.stroke();

      //C label
      ctx.fillText(distanceC + ' ' + unitC, offX+0.5, offY + 12.5);
    } else {
      ctx.fillText('< 0.1 LS', offX+0.5, offY + 12.5);
    }

    ctx.restore();
  }

  renderObject(ctx, knownSystemBody, coord) {
    const minBodyOrbitRenderSize = 5;
    const systemBody = knownSystemBody.systemBody;

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
      this.selectedKnownSystemBody = knownSystemBody;
    }

    const contextMenuHandler = (e, position) => {
      this.props.onShowSystemBodyContext(position, knownSystemBody);
    }

    switch(systemBody.body.type) {
      case 'star':
        this.renderCircle(ctx, starCircle, coord, systemBody.body.radius * this.zoom, knownSystemBody.name, selectedHandler, contextMenuHandler);
        break;
      case 'moon':
        this.renderCircle(ctx, moonCircle, coord, systemBody.body.radius * this.zoom, knownSystemBody.name, selectedHandler, contextMenuHandler);
        break;
      case 'gas giant':
        this.renderCircle(ctx, gasGiantCircle, coord, systemBody.body.radius * this.zoom, knownSystemBody.name, selectedHandler, contextMenuHandler);
        break;
      case 'planet':
      default:
        this.renderCircle(ctx, planetCircle, coord, systemBody.body.radius * this.zoom, knownSystemBody.name, selectedHandler, contextMenuHandler);
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
      ctx.save();

      ctx.font = '11px Arial, Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgb(255,255,255)';

      ctx.shadowColor = '#000';
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 3;

      ctx.fillText(label, coord.x, coord.y + radius + 15);

      ctx.restore();
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
const starCircle = new Circle(7, 0xFFFDFF00);
const planetCircle = new Circle(5, 0xFF3333FF);
const gasGiantCircle = new Circle(6, 0xFF6666CC);
const moonCircle = new Circle(4, 0xFF4444FF);

const orbitCircle = new Circle(1, null, 0x66FFFFFF, 0.8);
