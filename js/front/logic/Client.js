import React from 'react';
import {render} from 'react-dom';

import {EventDispatcher} from '../../core/EventDispatcher';

//definitions
import OrbitalFacility from '../../core/definitions/OrbitalFacility';
import SurfaceFacility from '../../core/definitions/SurfaceFacility';

//states
import {Colony} from '../states/Colony';

//interface stuff
import {SystemView} from '../interface/SystemView.jsx';
import {ContextMenu} from '../interface/ContextMenu.jsx';//TODO move this into a controller/renderer
import {DataMenu} from '../interface/DataMenu.jsx';

//windows stuff
import {Windowing} from '../interface/Windowing.jsx';
import {ColonyDetails} from '../interface/ColonyDetails.jsx';
import {GetFactionChanges} from './GetFactionChanges';


//Config
const minTimeSinceLastUpdate = 0;
let globalGameConfig = null;

export class Client extends EventDispatcher{
  constructor($element, gameConfig) {
    super();

    this._$element = $element;
    globalGameConfig = this._gameConfig = gameConfig;

    //Create definitions
    this._orbitalFacilities = gameConfig.orbitalFacilities.map((facility) => {return new OrbitalFacility(facility)});
    this._surfaceFacilities = gameConfig.surfaceFacilities.map((facility) => {return new SurfaceFacility(facility)});

    this._factionId = null;
    this._connector = null;
    this._state = null;
    this._selectedSystemId = null;

    this._constantPlay = false;
    this._isPlaying = false;
    this._lastUpdateTime = 0;

    this._engineUpdatePeriod = 86400;//time in seconds
    this._isAwaitingEngineUpdate = false;

    this._isDestroyed = false;

    this.tick = this.tick.bind(this);
    this._onShowSystemBodyContext = this._onShowSystemBodyContext.bind(this);
    this._clearContextMenu = this._clearContextMenu.bind(this);
    this._onComponentChanged = this._onComponentChanged.bind(this);
    this._topMenuClick = this._topMenuClick.bind(this);

    this._contextMenuItems = null;
    this._onContextMenuClicked = null;
    this._contextMenuPosition = null;

    this._renderDirty = true;

    //windowing component
    this._colonyDetailsPanel = new ColonyDetails.Controller(this);


    this._windowing = new Windowing.Controller();
    this._windowing.addWindow('colonyDetails', 'Colony Details', this._colonyDetailsPanel);

    this._windowing.addListener('changed', this._onComponentChanged);
    this._colonyDetailsPanel.addListener('changed', this._onComponentChanged);

    this._onStateChanged = this._onStateChanged.bind(this);
    this._stateChangeListener = null;
  }

  get gameConfig() {
    return this._gameConfig;
  }

  get factionId() {
    return this._factionId;
  }

  set factionId(value) {
    this._factionId = value;

    this._reRender();
  }

  update(newStateObj) {
    if(!newStateObj) {
      return;
    }

    this._state = newStateObj;
    this._isAwaitingEngineUpdate = false;
    this._lastUpdateTime = Date.now() / 1000;

    //clean up any previous state change listeners
    if(this._stateChangeListener) {
      this._stateChangeListener.remove();
      this._stateChangeListener = null;
    }

    //listen to any future changed
    this._stateChangeListener = this._state.addListener('changed', this._onStateChanged);

    //Let any components know that the game state has updated
    this._onStateChanged();

    console.log(newStateObj);
  }

  _onStateChanged() {
    this.dispatchEvent({type:'gameStateUpdated', updatedGameState: this._state});

    this._reRender();
  }

  _reRender() {
    this._renderDirty = true;
  }

  _doRender() {
    if(!this._state || !this._renderDirty) {
      return;
    }

    this._systemView = render(
      <div>
        {this._getContextMenu()}
        {this._windowing.render()}
        <SystemView
          selectedSystemId={this.selectedSystemId}
          gameState={this._state}
          constantPlayOn={this._constantPlay}
          onConstantPlayToggle={() => {
            this._constantPlay = !this._constantPlay;
            this._isPlaying = false;

            this._reRender();
          }}
          onGameStepSelected={(stepSize)=>{
            this._engineUpdatePeriod = stepSize;
            this._isPlaying = true;

            this._reRender();
          }}
          onTopMenuClick={this._topMenuClick}
          onShowSystemBodyContext={this._onShowSystemBodyContext}
        />
      </div>, this.$element[0]);

    //no longer render dirty
    this._renderDirty = false;
  }

  get selectedSystemId() {
    if(this._selectedSystemId != null) {
      return this._selectedSystemId;
    }

    const knownSystems = this._state.knownSystems;

    if(this._state != null) {
      for(let id in knownSystems) {
        if(knownSystems.hasOwnProperty(id)) {
          return this._selectedSystemId = id;//just default to the first known system
        }
      }
    }

    //If you get here, there's nothing to render!
    return null;
  }

  _onComponentChanged() {
    this._reRender();
  }

  //Interface methods
  _topMenuClick(clicked) {
    switch(clicked) {
      case 'colonies':
        this._windowing.focussedWindowId = 'colonyDetails';
        break;
    }
  }

  //Rendering methods
  _getContextMenu() {
    if(!this._contextMenuItems || !this._contextMenuPosition) {
      return null;
    }
    return <div className="contextMenuHolder" onClick={this._clearContextMenu}><ContextMenu x={this._contextMenuPosition.x} y={this._contextMenuPosition.y}>
      <DataMenu items={this._contextMenuItems} onItemClick={this._onContextMenuClicked} />
    </ContextMenu></div>
  }

  //Context menu methods
  _onShowSystemBodyContext(position, knownSystemBody) {
    this._contextMenuPosition = position;
    this._contextMenuItems = [];
    this._onContextMenuClicked = (e, item) => {//TODO should probably be a class method?
      switch(item.key) {
        case 'view'://TODO center newly opened window
          let colony = this._state.getColonyOnBody(knownSystemBody);

          this._windowing.focussedWindowId = 'colonyDetails';
          this._colonyDetailsPanel.colony = colony;
          break;
        case 'create':
          //create a temporary colony
          //id, systemBody, population, mineralsStockpile, orbitalMinerals
          //TODO initial minerals
          this._state._addState(new Colony(getTempId(), knownSystemBody.systemBody, 0, null, null));
          break;
        case 'info':
          //open system body info window
          console.log('Info: ', knownSystemBody);
      }
    };

    //create context menu data items
    //TODO should be part of knownSystemBody
    if(knownSystemBody.isColonisable) {
      if(this._state.hasColonyOnBody(knownSystemBody)) {
        this._contextMenuItems.push({type:'leaf', label: 'View colony', key: 'view'});
      } else {
        this._contextMenuItems.push({type:'leaf', label: 'Create colony', key: 'create'});
      }
    }

    this._contextMenuItems.push({type:'leaf', label: 'See body details', key: 'info'});

    //TODO view other colonies


    this._reRender();
  }

  _clearContextMenu() {
    this.setContextMenu(null, null, null);
  }

  setContextMenu(position, menuItems, itemClickHandler) {
    this._contextMenuPosition = position;
    this._contextMenuItems = menuItems;
    this._onContextMenuClicked = itemClickHandler;

    this._reRender();
  }

  tick () {
    if(this._isDestroyed ) {
      return;
    }

    window.requestAnimationFrame(this.tick);

    if(!this._isAwaitingEngineUpdate && this._isPlaying) {
      if(!this._constantPlay) {
        this._doEngineUpdate();
      } else if((Date.now()/1000) > (this._lastUpdateTime + minTimeSinceLastUpdate)) {
        this._doEngineUpdate();
      }
    }

    this._doRender();
  }

  _doEngineUpdate() {
    if(this._isAwaitingEngineUpdate) {
      return;
    }
    this._isAwaitingEngineUpdate = true;
    this._isPlaying = this._constantPlay;

    this._connector.updateEngine({
      id:this._state.id,
      updateUntil:this._engineUpdatePeriod + this._state.time,
      changes: GetFactionChanges(this._state)
    });
  }

  get $element() {
    return this._$element;
  }

  setConnector(connector, initialState) {
    this._connector = connector;

    this.tick();
  }

}

let tempId = -1;

function getTempId() {
  return tempId--;
}

Client.getGameConfig = () => {
  return globalGameConfig;
}
