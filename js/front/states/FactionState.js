import {State} from './State';

import {GasGiant} from './system/GasGiant';
import {OrbitRegular} from './system/OrbitRegular';
import {Planet} from './system/Planet';
import {Star} from './system/Star';
import {System} from './system/System';
import {SystemBodyState} from './system/SystemBodyState';
import {SystemBodyMineral} from './system/SystemBodyMineral';
import {SystemBodyMinerals} from './system/SystemBodyMinerals';
import {KnownSystem} from './KnownSystem';
import {KnownSystemBody} from './KnownSystemBody';
import {KnownFaction} from './KnownFaction';
import {Colony} from './Colony';
import {MineralsStockpile} from './MineralsStockpile';

import {Coord} from '../../core/Coord';

export class FactionState extends State {
  constructor(stateObj) {
    const id = stateObj.factionId;
    const model = stateObj.models[id];

    super(id);

    this._fullName = model.fullName;
    this._shortName = model.shortName;
    this._adjectiveName = model.adjectiveName;

    this._time = stateObj.time;
    this._events = stateObj.events;

    //temp prop, needed to de-serialisation
    this._models = stateObj.models;

    //look-up for all known model states by id
    this._statesById = {};
    this._statesById[id] = this;


    this._systems = {};
    this._colonies = {};
    this._knownFactions = {};
    this._knownSystems = {};
    this._knownSystemBodies = {};

    this._knownSystemBySystemId = {};
    this._knownSystemBodyBySystemBodyId = {};
    this._knownFactionByFactionId = {};

    //now fully parse the state object
    this._getState(model.knownFactionIds);
    this._getState(model.knownSystemIds);
    this._getState(model.knownSystemBodyIds);
    this._getState(model.colonyIds);

    //Once parsing is complete
    delete this._models;
  }

  //Add state methods
  addColony(colony) {
    this._colonies[colony.id] = colony;
  }

  addSystem(systems) {
    this._systems[systems.id] = systems;
  }

  addKnownSystem(knownSystem) {
    this._knownSystems[knownSystem.id] = knownSystem;

    this._knownSystemBySystemId[knownSystem.system.id] = knownSystem;
  }

  addKnownSystemBody(knownSystemBody) {
    this._knownSystemBodies[knownSystemBody.id] = knownSystemBody;

    this._knownSystemBodyBySystemBodyId[knownSystemBody.systemBody.id] = knownSystemBody;


    this._knownSystemBySystemId[knownSystemBody.systemBody.system.id].addKnownSystemBody(knownSystemBody);
  }

  addKnownFaction(knownFaction) {
    this._knownFactions[knownFaction.id] = knownFaction;

    this._knownFactionByFactionId[knownFaction.factionId] = knownFaction;
  }

  /////////////////////
  // Parsing methods //
  /////////////////////

  //state object parsing methods
  _getState(data) {
    if(!data) {
      return null;
    }

    if(data instanceof Array) {
      return this._getArray(data);
    }

    let state = null;

    switch(data['class']) {
      //faction states
      case 'KnownFaction':
        state = this._getKnownFaction(data);
        break;
      case 'KnownSystem':
        state = this._getKnownSystem(data);
        break;
      case 'KnownSystemBody':
        state = this._getKnownSystemBody(data);
        break;
      //System states
      case 'System':
        state = this._getSystem(data);
        break;
      case 'SystemBodyState':
        state = this._getSystemBodyState(data);
        break;
      case 'SystemBodyMinerals':
        state = this._getSystemBodyMinerals(data);
        break;
      case 'SystemBodyMineral':
        state = this._getSystemBodyMineral(data);
        break;
      case 'Orbit':
      case 'OrbitRegular':
        state = this._getOrbit(data);
        break;

      case 'Colony':
        state = this._getColony(data);
        break;
      case 'MineralsStockpile':
        state = this._getMineralsStockpile(data);
        break;
      //Misc
      case 'Coord':
        return new Coord(data.x, data.y);
    }

    if(state) {
      this._addState(state);
    }

    return state;
  }

  _getArray(arr) {
    return arr.map((data) => {
      return this._getStateById(data);
    });
  }

  _getKnownFaction(data) {
    if(!data) {
      return null;
    }

    //id, faction, name
    return new KnownFaction(data.id, data.factionId, data.fullName, data.shortName, data.adjectiveName);
  }

  _getKnownSystem(data) {
    if(!data) {
      return null;
    }

    const bodies = [];

    //id, system, name, discoveryDate, knownJumpPoints
    return new KnownSystem(data.id, bodies, this._getStateById(data.systemId), data.name, data.discoveryDate, data.knownJumpPoints);//TODO known jump points
  }

  _getKnownSystemBody(data) {
    if(!data) {
      return null;
    }

    return new KnownSystemBody(data.id, this._getStateById(data.systemBodyId), data.name, this._getStateById(data.mineralsId));//TODO
  }

  _getSystemBodyMinerals(data) {
    if(!data) {
      return null;
    }

    return new SystemBodyMinerals(data.id, this._getState(data.mineralIds));
  }

  _getSystemBodyMineral(data) {
    return new SystemBodyMineral(data.id, data.name, data.amount, data.accessibility);
  }

  _getSystem(data) {
    const bodies = data.bodyIds.map((bodyId) => {
      return this._getStateById(bodyId);
    });

    const state = new System(data.id, bodies);

    return state;
  }

  _getSystemBodyState(data) {
    const state = new SystemBodyState(
      data.id,
      this._getSystemBody(data.body),
      this._getState(data.position),
      this._getStateById(data.orbitId));

    return state;
  }

  _getSystemBody(data) {
    let state = null;

    switch(data.type) {
      case 'star':
        //name, mass, radius, day, axialTilt, tidalLock, parent, luminosity
        state = new Star(null, data.mass, data.radius, data.day, data.axialTilt, data.tidalLock, this._getStateById(data.parentId), data.luminosity );
        break;
      case 'gas giant':
        //name, mass, radius, day, axialTilt, tidalLock, parent, minerals, colonies
        state = new GasGiant(null, data.mass, data.radius, data.day, data.axialTilt, data.tidalLock, this._getStateById(data.parentId), this._getStateById(data.mineralsId), null );
        break;
      case 'planet':
      case 'dwarf planet':
      case 'moon':
        //name, mass, radius, day, axialTilt, tidalLock, parent, albedo, minerals, colonies, surfaceHeating, minSurfaceHeating, maxSurfaceHeating, avgSurfaceHeating, surfaceTemp, minSurfaceTemp, maxSurfaceTemp, avgSurfaceTemp, atmosphere, type
        state = new Planet(
          null,
          data.mass,
          data.radius,
          data.day,
          data.axialTilt,
          data.tidalLock,
          this._getStateById(data.parentId),
          data.albedo,
          this._getStateById(data.mineralsId),
          null,
          data.surfaceHeating,
          data.minSurfaceHeating,
          data.maxSurfaceHeating,
          data.avgSurfaceHeating,
          data.surfaceTemp,
          data.minSurfaceTemp,
          data.maxSurfaceTemp,
          data.avgSurfaceTemp,
          null,
          data.type );

        break;
      case 'asteroid':
        throw new Error('Not implemented');
      case 'comet':
        throw new Error('Not implemented');
      default:
        throw new Error('Not implemented');
    }

    return state;
  }

  _getOrbit(data) {
    if(!data) {
      return null;
    }

    let state = null;

    switch(data['class']) {
      case 'OrbitRegular':
        //period, radius, angle
        state = new OrbitRegular(data.id, data.period, data.radius, data.angle);
        break;
      default:
        throw new Error('Not implemented');
    }

    return state;
  }

  _getColony(data) {
    if(!data) {
      return null;
    }

    //id, systemBody, population, mineralsStockpile, orbitalMinerals
    const state = new Colony(
      data.id,
      this._getStateById(data.systemBodyId),
      data.population,
      this._getStateById(data.mineralsStockpileId),
      this._getStateById(data.orbitalMineralsId));

    return state;
  }

  _getMineralsStockpile(data) {
    if(!data) {
      return null;
    }

    return new MineralsStockpile(data.id, data.minerals);
  }

  _addState(state) {
    if(!state) {
      return;
    }

    this._statesById[state.id] = state;

    switch(state.constructor.name) {
      case 'System':
      case 'KnownSystem':
      case 'KnownSystemBody':
      case 'Colony':
      case 'KnownFaction':
        this['add'+state.constructor.name](state);
        break;
    }
  }

  _getStateById(id) {
    return this._statesById.hasOwnProperty(id) ? this._statesById[id] : ( this._models.hasOwnProperty(id) ? this._getState(this._models[id]) : null);
  }

  _statesArrayToObject(arr) {
    const obj = {};

    arr.forEach((state) => {
      obj[state.id] = state;
    })

    return obj;
  }

  /////////////////////
  // Getters/setters //
  /////////////////////

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

  get time() {
    return this._time;
  }

  get systems() {
    return this._systems;
  }

  get colonies() {
    return this._colonies;
  }

  get events() {
    return this._events;
  }

}
