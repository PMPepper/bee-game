import React from 'react';
import {render} from 'react-dom';

import {SystemView} from '../interface/SystemView.jsx';
import {ContextMenu} from '../interface/ContextMenu.jsx';
import {DataMenu} from '../interface/DataMenu.jsx';

const minTimeSinceLastUpdate = 0;

export class Client {
  constructor($element) {
    this._$element = $element;
    this._factionId = null;
    this._connector = null;
    this._state;

    this._constantPlay = false;
    this._isPlaying = false;
    this._lastUpdateTime = 0;

    this._engineUpdatePeriod = 86400;//time in seconds
    this._isAwaitingEngineUpdate = false;

    this._isDestroyed = false;

    this.tick = this.tick.bind(this);
    this._onShowSystemBodyContext = this._onShowSystemBodyContext.bind(this);
    this._clearContextMenu = this._clearContextMenu.bind(this);

    this._contextMenuItems = null;
    this._onContextMenuClicked = null;
    this._contextMenuPosition = null;

  }

  get factionId() {
    return this._factionId;
  }

  set factionId(value) {
    this._factionId = value;

    this.doRender();
  }

  update(newStateObj) {
    //console.log('Client.update: ', newStateObj);

    if(!newStateObj) {
      return;
    }

    this._state = newStateObj;
    this._isAwaitingEngineUpdate = false;
    this._lastUpdateTime = Date.now() / 1000;

    this.doRender();
  }

  doRender() {
    if(!this._state) {
      return;
    }

    this._systemView = render(<div>
      {this._getContextMenu()}
      <SystemView
        selecteSystemIndex="0"
        gameState={this._state}
        constantPlayOn={this._constantPlay}
        onConstantPlayToggle={() => {
          this._constantPlay = !this._constantPlay;
          this._isPlaying = false;

          this.doRender();
        }}
        onGameStepSelected={(stepSize)=>{
          this._engineUpdatePeriod = stepSize;
          this._isPlaying = true;

          this.doRender();
        }}
        onShowSystemBodyContext={this._onShowSystemBodyContext}
      /></div>, this.$element[0]);
  }

  _onShowSystemBodyContext(position, systemBody) {
    this._contextMenuPosition = position;
    this._contextMenuItems = [];
    this._onContextMenuClicked = (e, item) => {//TODO should probably be a class method?
      switch(item.key) {
        case 'view':
          //TODO only colony window
          break;
        case 'create':
          //TODO create colony
          break;
        case 'info':
          //open system body info window
      }
    };

    //create context menu data items
    if(systemBody.isColonisable) {
      if(this._state.hasColonyOnBody(systemBody)) {
        this._contextMenuItems.push({type:'leaf', label: 'View colony', key: 'view'});
      } else {
        this._contextMenuItems.push({type:'leaf', label: 'Create colony', key: 'create'});
      }
    }

    this._contextMenuItems.push({type:'leaf', label: 'See body details', key: 'info'});

    //TODO view other colonies
    if(systemBody.isColonisable) {

    }

    this.doRender();
  }

  _getContextMenu() {
    if(!this._contextMenuItems || !this._contextMenuPosition) {
      return null;
    }
    return <div className="contextMenuHolder" onClick={this._clearContextMenu}><ContextMenu x={this._contextMenuPosition.x} y={this._contextMenuPosition.y}>
      <DataMenu items={this._contextMenuItems} onItemClick={this._onContextMenuClicked} />
    </ContextMenu></div>
  }

  _clearContextMenu() {
    this.setContextMenu(null, null, null);
  }

  setContextMenu(position, menuItems, itemClickHandler) {
    this._contextMenuPosition = position;
    this._contextMenuItems = menuItems;
    this._onContextMenuClicked = itemClickHandler;

    this.doRender();
  }

  tick () {
    if(this._isDestroyed ) {
      return;
    }

    window.requestAnimationFrame(this.tick);

    if(this._isAwaitingEngineUpdate || !this._isPlaying) {
      return ;
    }

    if(!this._constantPlay) {
      this._doEngineUpdate();
    } else if((Date.now()/1000) > (this._lastUpdateTime + minTimeSinceLastUpdate)) {
      this._doEngineUpdate();
    }
  }

  _doEngineUpdate() {
    if(this._isAwaitingEngineUpdate) {
      return;
    }
    this._isAwaitingEngineUpdate = true;
    this._isPlaying = this._constantPlay;

    this._connector.updateEngine([{
      id:this._state.id,
      updateUntil:this._engineUpdatePeriod + this._state.time
    }]);
  }

  get $element() {
    return this._$element;
  }

  setConnector(connector, initialState) {
    this._connector = connector;

    this.tick();
  }
}
