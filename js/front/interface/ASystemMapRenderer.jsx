import React from 'react';
import {render} from 'react-dom';
import {Coord} from '../../core/Coord';
import {BEMComponent} from './BEMComponent.jsx';

const zoomSpeed = 1.5;
const easeFactor = 1/10;//must be less than or equal to 0

export class ASystemMapRenderer extends BEMComponent {
  constructor(props, block) {
    super(props, block);


    this._element = null;
    this._zoom = +this.props.zoom || 1/1000000000;
    this._x = +this.props.x ||0;
    this._y = +this.props.y ||0;
    this._cx = +this.props.cx ||0.5;
    this._cy = +this.props.cy ||0.5;

    this._targetX = this._x;
    this._targetY = this._y;
    this._targetZoom = this._zoom;
    this._selectedKnownSystemBody = null;

    this._renderDirty = true;

    this.tick = this.tick.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onMouseWheel = this._onMouseWheel.bind(this);

    this._lastCoord = null;
    this._hasDragged = false;

    this._clickTargets = [];

    this.setElement = this.setElement.bind(this);

    if(new.target == ASystemMapRenderer) {
      throw new Error('Class ASystemMapRenderer cannot be instanciated directly');
    }
  }

  renderSystem() {
    this.clearClickTargets();
  }

  _onClick (screenPos) {
    this.selectedKnownSystemBody = null;

    //Check for click targets
    const clickTarget = this.getClickTargetAt(screenPos);

    if(clickTarget) {
      clickTarget.clickHandler();
      return;
    }

    //If you didn't click on a specific target
    const pos = this.screenToSystem(screenPos);

    this.panTo(pos.x, pos.y);
  }

  _onContextMenu(e) {
    e.preventDefault();

    const screenPos = this._getElementPosFromPage(e.pageX, e.pageY);

    //Check for click targets
    const clickTarget = this.getClickTargetAt(screenPos);

    if(clickTarget) {
      clickTarget.contextMenuHandler(e, new Coord(clickTarget.x, clickTarget.y));

      return;
    }
  }

  _onMouseDown(e) {
    if(e.nativeEvent.which != 1) {
      return;
    }

    e.preventDefault();

    $(window)
      .on('mousemove', this._onMouseMove)
      .on('mouseup mouseleave', this._onMouseUp);

    this._lastCoord = this._getElementPosFromPage(e.pageX, e.pageY);
    this._hasDragged = false;
  }

  _onMouseMove(e) {
    this.selectedKnownSystemBody = null;

    const mousePos = this._getElementPosFromPage(e.pageX, e.pageY);
    const deltaMousePos = mousePos.subtract(this._lastCoord);

    this.x -= deltaMousePos.x / this.zoom;
    this.y -= deltaMousePos.y / this.zoom;

    this._lastCoord = mousePos;
    this._hasDragged = true;
  }

  _onMouseUp(e) {
    $(window)
      .off('mousemove', this._onMouseMove)
      .off('mouseup mouseleave', this._onMouseUp);


    if(!this._hasDragged) {
      this._onClick(this._lastCoord);
    }

    this._lastCoord = null;
  }

  _onMouseWheel(e) {
    const mousePos = this.screenToSystem(this._getElementPosFromPage(e.pageX, e.pageY));

    this.zoomTo((e.deltaY < 0 ? zoomSpeed : 1/zoomSpeed), mousePos.x, mousePos.y);
  }

  _getElementPosFromPage(x, y) {
    let offset = $(this._element).offset();

    return new Coord(x - offset.left, y - offset.top);
  }

  panTo(x, y) {
    this._targetX = x;
    this._targetY = y;
  }

  zoomTo(deltaZoom, x, y) {
    const targetZoom = this.zoom * deltaZoom;

    const screenPos = this.systemToScreen(x, y);
    const targetPos = this.systemToScreen(x, y, targetZoom);

    const deltaX = (targetPos.x - screenPos.x)/targetZoom;
    const deltaY = (targetPos.y - screenPos.y)/targetZoom;

    this._targetZoom = targetZoom;
    this._targetX = this.x + deltaX;
    this._targetY = this.y + deltaY;
  }

  tick(timestamp) {
    if(!this._isMounted) {
      return;
    }

    if(this.selectedKnownSystemBody) {
      const selectedBodyPos = this.selectedKnownSystemBody.systemBody.position;

      this._targetX = selectedBodyPos.x;
      this._targetY = selectedBodyPos.y;
    }

    //TODO Improve easing - not  currently equal
    if(this._targetX != this._x) {
      this._x += (this._targetX - this._x) * easeFactor;//TODO take into account frameTime

      if(Math.abs(this._x - this._targetX) < 1) {
        this._x = this._targetX
      }

      this._renderDirty = true;
    }

    if(this._targetY != this._y) {
      this._y += (this._targetY - this._y) * easeFactor;//TODO take into account frameTime

      if(Math.abs(this._y - this._targetY) < 1) {
        this._y = this._targetY
      }

      this._renderDirty = true;
    }

    if(this._targetZoom != this._zoom) {
      this._zoom += (this._targetZoom - this._zoom) * easeFactor;//TODO take into account frameTime

      if(Math.abs(this._zoom - this._targetZoom) < 1/10000000000000) {
        this._zoom = this._targetZoom
      }

      this._renderDirty = true;
    }

    this.renderSystem();

    window.requestAnimationFrame(this.tick);
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

  setElement(element) {
    this._element = element;
    this._renderDirty = true;
  }

  get width () {
    return this.props.width;
  }

  get height () {
    return this.props.height;
  }

  get zoom() {
    return this._zoom;
  }

  set zoom(newZoom) {
    this._targetZoom = this._zoom = newZoom;
    this._renderDirty = true;
  }

  get x() {
    return this._x;
  }

  set x(newX) {
    this._targetX = this._x = newX;
    this._renderDirty = true;
  }

  get y() {
    return this._y;
  }

  set y(newY) {
    this._targetY = this._y = newY;
    this._renderDirty = true;
  }

  get cx () {
    return this._cx;
  }

  get cy () {
    return this._cy;
  }

  systemToScreen(x, y, zoom) {
    if(x instanceof Coord) {
      zoom = y === undefined ? this.zoom : y;
      y = x.y;
      x = x.x;
    } else {
      zoom = zoom === undefined ? this.zoom : zoom;
    }

    return new Coord(
      ((x - this.x) * zoom) + (this.width*this.cx),
      ((y - this.y) * zoom) + (this.height*this.cy),
    );
  }

  screenToSystem(x, y, zoom) {
    if(x instanceof Coord) {
      zoom = y === undefined ? this.zoom : y;
      y = x.y;
      x = x.x;
    } else {
      zoom = zoom === undefined ? this.zoom : zoom;
    }

    return new Coord(
      ((x - (this.cx * this.width)) / zoom) + this.x,
      ((y - (this.cy * this.height)) / zoom) + this.y
    );
  }

  clearClickTargets () {
    this._clickTargets.length = 0;
  }

  addClickTarget(screenX, screenY, radius, clickHandler, contextMenuHandler, cursor) {
    this._clickTargets.push({
      x:screenX,
      y:screenY,
      radius:radius*radius,
      clickHandler:clickHandler,
      contextMenuHandler: contextMenuHandler,
      cursor: cursor || 'pointer'
    })
  }

  getClickTargetAt(screenPos) {
    const clickTargets = this._clickTargets;

    for(let i = 0; i < clickTargets.length; i++) {
      let clickTarget = clickTargets[i];
      let distance2 = Math.pow(screenPos.x - clickTarget.x, 2) + Math.pow(screenPos.y - clickTarget.y, 2);

      if(distance2 < clickTarget.radius) {
        return clickTarget;
      }
    }

    return null;
  }

  get selectedKnownSystemBody() {
    if(this._selectedKnownSystemBody == null || !this.props || !this.props.system) {
      this._selectedKnownSystemBody = null;

      return null;
    }

    return this.props.system.getKnownSystemBodyById(this._selectedKnownSystemBody);
  }

  set selectedKnownSystemBody(knownSystemBody) {
    this._selectedKnownSystemBody = knownSystemBody ? knownSystemBody.id : null;
  }
}
