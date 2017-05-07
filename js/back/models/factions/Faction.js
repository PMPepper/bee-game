import {Model} from '../Model';
import {KnownFaction} from './KnownFaction';
import {KnownSystem} from './KnownSystem';
import {KnownTechnology} from './KnownTechnology';
import {KnownContact} from './KnownContact';
import {Colony} from '../Colony';
import {FactionSystemBodyName} from './FactionSystemBodyName';

export class Faction extends Model {
  constructor (colonies, craft, knownTechnologies, knownFactions, knownSystems, knownContacts, systemBodyNames) {
    super();

    this._colonies = colonies ? Object.assign(colonies, {}) : {};
    this._craft = craft ? Object.assign(craft, {}) : {};

    this._knownTechnologies = knownTechnologies ? Object.assign(knownTechnologies, {}) : {};
    this._knownFactions = knownFactions ? Object.assign(knownFactions, {}) : {};
    this._knownSystems = knownSystems ? Object.assign(knownSystems, {}) : {};
    this._knownContacts = knownContacts ? Object.assign(knownContacts, {}) : {};


    this._systemBodyNames = systemBodyNames ? Object.assign(systemBodyNames, {}) : {};

    this.updateUntil = null;
    this._events = [];
  }

  addEvent(event) {
    this._events.push();
  }

  getEventsStateAndReset() {
    const events = [];

    this._events.forEach((event) => {
      events.push(event.getState());
    });

    this._events.length = 0;

    return events;
  }

  addColony(colony) {
    this._colonies[colony.id] = colony;

    colony.setFaction(this);
  }

  //TODO known technologies methods
  isKnownTechnology (technology) {
    return !!this._isKnownTechnology[Model.id(technology)];
  }

  //known faction methods
  isKnownFaction (faction) {
    return !!this._knownFactions[Model.id(faction)];
  }

  getFactionName (faction) {
    return this._knownFactions[Model.id(faction)] ? this._knownFactions[Model.id(faction)].name : null;
  }

  getKnownFaction (faction) {
    return this.isKnownFaction(faction) ? this._knownFactions[Model.id(faction)] : null;
  }

  addKnownFaction (faction, name) {
    if(this.isKnownFaction(faction)) {
      return;
    }

    this._knownFactions[faction.id] = new KnownFaction(this.id+':'+faction.id, faction, name);
  }

  //known system methods
  isKnownSystem (system) {
      return !!this._knownSystems[Model.id(system)];
  }

  getSystemName(system) {
    return this.isKnownSystem(system) ? this._knownSystems[Model.id(system)].name : null;
  }

  getKnownSystem (system) {//returns FactionSystem
    return this.isKnownSystem(system) ? this._knownSystems[Model.id(system)] : null;
  }

  addKnownSystem (system, name) {
    if(this.isKnownSystem(system)) {
      return;
    }

    this._knownSystems[system.id] = new KnownSystem(this.id+':'+system.id, system.id, name, null);
  }

  //TODO known contacts methods

  //System body names
  isKnownBody(body) {
    return this.isKnownSystem(body.system);
  }

  setSystemBodyName(body, name) {
    if(!this.isKnownBody(body)) {
      return null;
    }

    this._systemBodyNames[body.id] = new FactionSystemBodyName(body, name) ;
  }

  getSystemBodyName(body) {
    if(!this.isKnownBody(body)) {
      return null;
    }

    this._systemBodyNames[body.id] ? this._systemBodyNames[body.id].name : null ;
  }

  //getter/setters
  get name() {
    return this.getFactionName(this.id);
  }

  get colonies () {
    return this._colonies;
  }

  get craft () {
    return this._craft;
  }

  get knownTechnologies () {
    return this._knownTechnologies;
  }

  get knownFactions () {
    return this._knownFactions;
  }

  get knownSystems () {
    return this._knownSystems;
  }

  get knownContacts () {
    return this._knownContacts;
  }

  getState () {
    return this._state({
      colonyIds:          this.getObjectState(this.colonies),
      craftIds:           this.getObjectState(this.craft),
      knownTechnologyIds: this.getObjectState(this.knownTechnologies),
      knownFactionIds:    this.getObjectState(this.knownFactions),
      knownSystemIds:     this.getObjectState(this.knownSystems),
      knownContactIds:    this.getObjectState(this.knownContacts),
      systemBodyNameIds:  this.getObjectState(this._systemBodyNames)
    });
  }
}
