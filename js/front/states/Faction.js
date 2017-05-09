import {SystemBodyState} from './system/SystemBodyState';

export class Faction {
  constructor(id, fullName, shortName, adjectiveName, knownFactions, knownSystems, knownSystemBodies) {
    this._id = id;
    this._fullName = fullName;
    this._shortName = shortName;
    this._adjectiveName = adjectiveName;
    this._knownFactions = knownFactions;
    this._knownSystems = knownSystems;
    this._knownSystemBodies = knownSystemBodies;
  }

  get id() {
    return this._id;
  }

  get fullName() {
    return this._fullName;
  }

  get shortName() {
    return this._shortName;
  }

  get adjectiveName() {
    return this._adjectiveName;
  }

  get knownFactions() {
    return this._knownFactions;
  }

  get knownSystems() {
    return this._knownSystems;
  }

  get knownSystemBodies() {
    return this._knownSystemBodies;
  }

  getSystemBodyName(systemBody) {
    if(systemBody instanceof SystemBodyState) {
      systemBody = systemBody.body;
    }
    const knownSystemBody = this._knownSystemBodies.filter((knownSystemBody) => {
      return knownSystemBody.systemBody.body == systemBody;
    }).pop();

    if(knownSystemBody) {
      return knownSystemBody.name;
    }

    //TODO use naming assignment system?
    return '??';
  }

  hasColonyOnBody(systemBody) {
    return false;

    systemBody.body.colonies.forEach((colony) => {
      if(colony) {
        
      }
    } );
    //TODO implement
    return false;
  }
}
