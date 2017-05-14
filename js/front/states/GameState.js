import {State} from './State';
import {FactionState} from './FactionState';

export class GameState extends FactionState {
  constructor(stateObj) {
    super(stateObj);

    this._originalFactionState = new FactionState(stateObj);
    this._stateObj = stateObj;
  }
  //Add state methods


  //general faction methods
  isKnownSystemBody(systemBody) {
    return this._knownSystemBodyBySystemBodyId.hasOwnProperty(systemBody.id);
  }

  getKnownSystemBodyBySystemBody(systemBody) {
    return this._knownSystemBodyBySystemBodyId[systemBody.id] || null;
  }

  getSystemBodyName(systemBody) {
    const knownSystemBody = this.getKnownSystemBodyBySystemBody(systemBody);

    //TODO default name scheme for system bodies
    return knownSystemBody ? knownSystemBody.name : '??';
  }

  hasColonyOnBody(knownSystemBody) {
    if(!knownSystemBody.isColonisable) {//TODO this should be part of knownSystemBody
      return false;
    }

    const colonies = this.colonies;

    for(let id in colonies) {
      if(colonies.hasOwnProperty(id)) {
        let colony = colonies[id];

        if(colony.systemBody == knownSystemBody.systemBody && !colony.removed) {
          return true
        }
      }
    }

    return false;
  }

  getColonyOnBody(knownSystemBody) {
    if(!knownSystemBody.isColonisable) {//TODO this should be part of knownSystemBody
      return null;
    }

    const colonies = this.colonies;

    for(let id in colonies) {
      if(colonies.hasOwnProperty(id)) {
        let colony = colonies[id];

        if(colony.systemBody == knownSystemBody.systemBody && !colony.removed) {
          return colony;
        }
      }
    }

    return null;
  }

  getStateById(id) {
    return this._statesById[id] || null;
  }

  _addState(state) {
    if(!state) {
      return;
    }

    if(state instanceof State) {
      state.addListener('changed', () => {
        this.dispatchEvent({type:'changed'});
      });
    }

    super._addState(state);

    //dispatch a changed event
    this._changed();
  }

  /////////////////////
  // Getters/setters //
  /////////////////////


  get stateObj() {
    return this._stateObj;
  }

  get originalFactionState() {
    return this._originalFactionState;
  }

}
